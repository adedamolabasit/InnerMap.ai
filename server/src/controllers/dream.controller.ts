import { Request, Response } from "express";
import Dream from "../models/Dream";
import { AuthenticatedRequest } from "../types/auth";
import { User } from "../models/User";
import { addTodoistTask } from "../agents/tools/todoist";
import { openai } from "../services/opik";
import { toFile } from "openai";
import { validateBody } from "../utils";
import { dreamQueue } from "../queues/queue";

export const audioTranscribe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    if (!req.file)
      return res.status(400).json({ error: "No audio file provided" });

    const audioFile = await toFile(req.file.buffer, req.file.originalname, {
      type: req.file.mimetype,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-transcribe",
    });

    return res.json({ text: transcription.text });
  } catch (err) {
    console.error("Transcription error:", err);
    return res.status(500).json({ error: "Failed to process dream" });
  }
};

export const submitDream = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const bodyError = validateBody(["dreamText"], req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const { dreamText } = req.body;

    const dreamEntry = await Dream.create({
      userId,
      dreamText,
      intake: null,
      reflection: null,
      action: null,
    });

    await dreamQueue.add("analyzeDream", {
      dreamId: dreamEntry._id.toString(),
      dreamText,
      userId,
    });

    res.json({ success: true, dream: dreamEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit dream" });
  }
};

export const getUserDreams = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const dreams = await Dream.find({ userId }).sort({ createdAt: -1 });

    const response = dreams.map((dream) => ({
      userId,
      id: dream._id.toString(),
      content: dream.dreamText,
      date: dream.createdAt.toISOString(),
      mood: dream.intake?.emotions?.[0],
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user dreams" });
  }
};

export const getDreamById = async (req: Request, res: Response) => {
  try {
    const { dreamId } = req.params;
    if (!dreamId) return res.status(400).json({ error: "Missing dreamId" });

    const dream = await Dream.findById(dreamId);
    if (!dream) return res.status(404).json({ error: "Dream not found" });

    res.json(dream);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dream" });
  }
};

export const deleteDream = async (req: Request, res: Response) => {
  try {
    const { dreamId } = req.params;
    if (!dreamId) return res.status(400).json({ error: "Missing dreamId" });

    const dream = await Dream.findById(dreamId);
    if (!dream) return res.status(404).json({ error: "Dream not found" });

    await Dream.deleteOne({ _id: dreamId });

    res.json({ success: true, message: "Dream deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete dream" });
  }
};

export const startReflection = async (req: Request, res: Response) => {
  try {
    const bodyError = validateBody(["actionId"], req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const userId = req.user?.id;
    const { actionId } = req.body;

    const profile = await User.findById(userId).select(
      "+todoistAccessToken +todoistTokenExpiry +todoistConnectedAt",
    );
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const dream = await Dream.findOne({
      userId,
      "action._id": actionId,
    });
    if (!dream)
      return res.status(404).json({ error: "Dream/action not found" });

    if (dream.todoisUrl) return res.status(200).json({ url: dream.todoisUrl });

    const todoist = await addTodoistTask(
      profile.todoistAccessToken as string,
      dream.action,
      dream.reflection,
    );

    await Dream.updateOne(
      { userId, "action._id": actionId },
      { $set: { todoisUrl: todoist?.url } },
    );

    return res.status(200).json({ url: todoist?.url });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const completeAction = async (req: Request, res: Response) => {
  try {
    const bodyError = validateBody(["dreamId"], req.body);
    if (bodyError) return res.status(400).json({ error: bodyError });

    const { dreamId } = req.body;
    const dream = await Dream.findById(dreamId);
    if (!dream) return res.status(404).json({ error: "Dream not found" });

    if (dream.action) {
      dream.action.completed = true;
      dream.action.completedAt = new Date();
      await dream.save();
    }

    res.json({ success: true, dream });
  } catch (err) {
    res.status(500).json({ error: "Failed to update action" });
  }
};
