import { Request, Response } from "express";
import { analyzeDreamIntake } from "../agents/intake.agent";
import { analyzeReflection } from "../agents/reflection.agent";
import { analyzeAction } from "../agents/action.agent";
import Dream from "../models/Dream";
import { executeAgenticHooks } from "../services/agenticTools";
import { StoredAction } from "../models/types";
import axios from "axios";
import { AuthenticatedRequest } from "../types/auth";
import { User } from "../models/User";

// Update the function signature
export const submitDream = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Now TypeScript knows req.user exists
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
    const userId = req.user?.id;

    const dreams = await Dream.find({ userId }).sort({ createdAt: -1 });

    const response = dreams.map((dream) => ({
      userId,
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

export const authTodoist = async (req: Request, res: Response) => {
  try {
    const { dreamId, userId } = req.params;

    const statePayload = {
      userId,
      dreamId,
    };

    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64");

    const params = new URLSearchParams({
      client_id: process.env.TODOIST_CLIENT_ID!,
      scope: "data:read_write",
      state: state,
    });
    res.redirect(`https://todoist.com/oauth/authorize?${params.toString()}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete dream" });
  }
};

export const authTodoisCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || typeof state !== "string") {
      return res.status(400).json({ error: "Missing code or state" });
    }

    const decodedState = JSON.parse(
      Buffer.from(state, "base64").toString("utf-8"),
    );

    const { userId, dreamId } = decodedState;

    const response = await axios.post(
      "https://todoist.com/oauth/access_token",
      {
        client_id: process.env.TODOIST_CLIENT_ID!,
        client_secret: process.env.TODOIST_CLIENT_SECRET!,
        code,
      },
    );

    const { access_token, expires_in } = response.data;

    console.log("Todoist token received:", response);

    // ✅ state === userId (as you originally sent it)

    const result = await User.updateOne(
      { visitorId: userId }, 
      {
        $set: {
          todoistAccessToken: access_token,
          todoistTokenExpiry: expires_in,
        },
      },
    );

    console.log("Mongo update result:", result);

    res.redirect(`http://localhost:3000/?view=details&dreamId=${dreamId}`);
  } catch (err) {
    console.error("Todoist OAuth error:", err);
    res.status(500).json({ error: "Todoist auth failed" });
  }
};
