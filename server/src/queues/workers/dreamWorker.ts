// src/queues/workers/dreamWorker.ts
import { Worker } from "bullmq";
import { connectDB } from "../../db";
import { connection } from "../queue";
import Dream from "../../models/Dream";
import { analyzeDreamIntake } from "../../agents/intake.agent";
import { analyzeReflection } from "../../agents/reflection.agent";
import { analyzeAction } from "../../agents/action.agent";
import { executeAgenticHooks } from "../../services/agenticTools";

// Connect to MongoDB first
connectDB().then(() => console.log("Worker connected to MongoDB"));

const worker = new Worker(
  "dreamQueue",
  async (job: any) => {
    console.log("Picked up job:", job.id, job.data);

    const { dreamId, dreamText, userId } = job.data;

    const lastDream = await Dream.findOne({ userId }).sort({ createdAt: -1 });
    const previousActionCompleted = lastDream?.action?.completed ?? false;

    const intake = await analyzeDreamIntake(dreamText);
    const reflection = await analyzeReflection(dreamText);
    const action = await analyzeAction(reflection.themes, intake.agency, previousActionCompleted);
    const hookResults = await executeAgenticHooks(action.agenticHooks);

    await Dream.findByIdAndUpdate(dreamId, {
      intake,
      reflection,
      action: { ...action, hookResults, completed: false },
    });

    console.log(`Dream ${dreamId} processed successfully`);
  },
  { connection }
);

worker.on("completed", (job: any) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job: any, err: any) => console.error(`Job ${job.id} failed:`, err));

console.log("Dream worker is running...");
export default worker;
