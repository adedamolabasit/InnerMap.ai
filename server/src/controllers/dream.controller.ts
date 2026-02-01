import { Request, Response } from "express";
import { analyzeDreamIntake } from "../agents/intake.agent";
import { analyzeReflection } from "../agents/reflection.agent";
import { analyzeAction } from "../agents/action.agent";
import Dream from "../models/Dream";
import { executeAgenticHooks } from "../services/agenticTools";
import { StoredAction } from "../models/types";
import { AuthenticatedRequest } from "../types/auth";
import { User } from "../models/User";
import { addTodoistTask } from "../agents/tools/todoist";

export const submitDream = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { dreamText } = req.body;

    const lastDream = await Dream.findOne({ userId }).sort({ createdAt: -1 });

    const previousActionCompleted = lastDream?.action?.completed ?? false;

    const intake = await analyzeDreamIntake(dreamText);

    const reflection = await analyzeReflection(dreamText);

    const action = await analyzeAction(
      reflection.themes,
      intake.agency,
      previousActionCompleted,
    );

    const hookResults = await executeAgenticHooks(action.agenticHooks);

    const storedAction: StoredAction = {
      ...action,
      hookResults,
      completed: false,
    };

    const dreamEntry = await Dream.create({
      userId,
      dreamText,
      intake,
      reflection,
      action: storedAction,
    });

    res.json(dreamEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process dream" });
  }
};

export const completeAction = async (req: Request, res: Response) => {
  try {
    const { dreamId } = req.body;

    const dream = await Dream.findById(dreamId);
    if (!dream) return res.status(404).json({ error: "Dream not found" });

    dream.action.completed = true;
    dream.action.completedAt = new Date();

    await dream.save();

    res.json({ success: true, dream });
  } catch (err) {
    res.status(500).json({ error: "Failed to update action" });
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

    const dream = await Dream.findById(dreamId);
    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }

    res.json(dream);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dream" });
  }
};

export const startReflection = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { actionId } = req.body;

    const profile = await User.findById(userId).select(
      "+todoistAccessToken +todoistTokenExpiry +todoistConnectedAt",
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const dream = await Dream.findOne({
      userId,
      "action._id": actionId,
    });

    if (!dream) {
      return res.status(404).json({ error: "Dream/action not found" });
    }

    if (dream.todoisUrl) {
      return res.status(200).json({ url: dream.todoisUrl });
    }

    const todoist = await addTodoistTask(
      profile.todoistAccessToken as string,
      dream.action,
    );

    await Dream.updateOne(
      {
        userId,
        "action._id": actionId,
      },
      {
        $set: {
          todoisUrl: todoist.url,
        },
      },
    );

    return res.status(200).json({ url: todoist.url });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const deleteDream = async (req: Request, res: Response) => {
  try {
    const { dreamId } = req.params;

    const dream = await Dream.findById(dreamId);
    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }

    await Dream.deleteOne({ _id: dreamId });

    res.json({ success: true, message: "Dream deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete dream" });
  }
};
