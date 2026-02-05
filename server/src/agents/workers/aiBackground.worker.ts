import { Worker } from "bullmq";
import { connectDB } from "../../db";
import { connection } from "../../queues/queue";
import Dream from "../../models/Dream";
import { analyzeDreamIntake } from "../intake.agent";
import { analyzeReflection } from "../reflection.agent";
import { analyzeAction } from "../action.agent";
import { executeAgenticHooks } from "../../services/agenticTools";
import { openaiOpikThread } from "../../services/opik";

connectDB().then(() => console.log("Worker connected to MongoDB"));

const worker = new Worker(
  "dreamQueue",
  async (job: any) => {
    const { dreamId, dreamText, userId } = job.data;

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

    openaiOpikThread.trace({
      name: "dream-cycle",
      threadId: userId,

      metadata: {
        dreamId,
        agency: intake.agency,
        previousActionCompleted,
        actionType: action.type,
      },

      input: {
        dreamText,
      },

      output: {
        themes: reflection.themes,
        action: action.content,
      },
    });

    await Dream.findByIdAndUpdate(dreamId, {
      intake,
      reflection,
      action: { ...action, hookResults, completed: false },
    });
  },
  { connection },
);

worker.on("completed", (job: any) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job: any, err: any) =>
  console.error(`Job ${job.id} failed:`, err),
);

export default worker;
