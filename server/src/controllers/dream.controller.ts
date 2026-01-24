// src/controllers/dream.controller.ts
import { Request, Response } from "express";
import { analyzeDreamIntake } from "../agents/intake.agent";
import { analyzeReflection } from "../agents/reflection.agent";
import { analyzeAction } from "../agents/action.agent";
import Dream from "../models/Dream";


export const submitDream = async (req: Request, res: Response) => {
  try {
    const { userId, dreamText } = req.body;

    // 1️⃣ Intake Agent
    const intake = await analyzeDreamIntake(dreamText);

    // 2️⃣ Reflection Agent
    const reflection = await analyzeReflection(dreamText);

    // 3️⃣ Action Agent (conditional on agency)
    const action = await analyzeAction(reflection.themes, intake.agency);

    // 4️⃣ Save to DB
    const dreamEntry = await Dream.create({
      userId,
      dreamText,
      intake,
      reflection,
      action,
    });

      // 5️⃣ TODO: Action Execution
    // if (action.type === 'todo') add to user's todo list
    // if (action.type === 'goal') schedule goal tracker
    // if (action.type === 'reflect') create reminder for journaling

    res.json(dreamEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process dream" });
  }
};


// src/controllers/dream.controller.ts
// export const completeAction = async (req: Request, res: Response) => {
//   try {
//     const { dreamId, actionCompleted } = req.body;
//     const dream = await Dream.findById(dreamId);
//     if (!dream) return res.status(404).json({ error: "Dream not found" });

//     dream.action.completed = actionCompleted;
//     dream.save();

//     // Optionally, feed back to agent for adaptive suggestions next time
//     res.json(dream);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update action" });
//   }
// };
