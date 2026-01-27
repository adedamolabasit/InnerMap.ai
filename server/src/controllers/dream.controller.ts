import { Request, Response } from "express";
import { analyzeDreamIntake } from "../agents/intake.agent";
import { analyzeReflection } from "../agents/reflection.agent";
import { analyzeAction } from "../agents/action.agent";
import Dream from "../models/Dream";
import { executeAgenticHooks } from "../services/agenticTools";
import { StoredAction } from "../models/types";


export const submitDream = async (req: Request, res: Response) => {
  try {
    const { userId, dreamText } = req.body;

    const lastDream = await Dream.findOne({ userId }).sort({ createdAt: -1 });

    const previousActionCompleted = lastDream?.action?.completed ?? false;

    const intake = await analyzeDreamIntake(dreamText);

    const reflection = await analyzeReflection(dreamText);

    const action = await analyzeAction(
      reflection.themes,
      intake.agency,
      previousActionCompleted,
    );

    const hookResults = await executeAgenticHooks(action.agenticHooks, {
      userId,
      content: action.content,
      duration: action.duration,
    });

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
    const { userId } = req.params;

    const dreams = await Dream.find({ userId }).sort({ createdAt: -1 });

    const response = dreams.map((dream) => ({
      id: dream._id.toString(),
      content: dream.dreamText,
      date: dream.createdAt.toISOString(),

      // Optional: derive mood from intake emotions
      mood: dream.intake?.emotions?.[0], 
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dream" });
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
    console.error(err);
    res.status(500).json({ error: "Failed to delete dream" });
  }
};

