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
import { addTodoistTask } from "../agents/tools/todoist";

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

    console.log(action, "ew");

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

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(userId, "id");

    const profile = await User.findById(userId).select(
      "+todoistAccessToken +todoistTokenExpiry +todoistConnectedAt",
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
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

    // Redirect if already has a Todoist URL
    if (dream.todoisUrl) {
      return res.status(200).json({ url: dream.todoisUrl });
    }

    // Create Todoist task
    const todoist = await addTodoistTask(
      profile.todoistAccessToken as string,
      dream.action,
    );

    // Update the dream's action with the new URL

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
    console.error(err);
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

    // ✅ state === userId (as you originally sent it)

    const result = await User.updateOne(
      { visitorId: userId },
      {
        $set: {
          todoistAccessToken: access_token,
          todoistTokenExpiry: expires_in,
          todoistConnectedAt: new Date(),
        },
      },
    );

    res.redirect(`http://localhost:3000/?view=details&dreamId=${dreamId}`);
  } catch (err) {
    console.error("Todoist OAuth error:", err);
    res.status(500).json({ error: "Todoist auth failed" });
  }
};
