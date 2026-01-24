import mongoose, { Schema, Document } from "mongoose";
import {
  DreamIntakeResult,
  ReflectionResult,
  ActionAgentResult,
} from "../agents/types";

export interface DreamDocument extends Document {
  userId: string;
  dreamText: string;
  intake: DreamIntakeResult;
  reflection: ReflectionResult;
  action: ActionAgentResult;
  createdAt: Date;
}

const ActionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["todo", "goal", "reflect"],
    required: true,
  },
  content: { type: String, required: true },
  duration: String,

  agenticHooks: [{ type: String }],

  hookResults: [
    {
      hook: String,
      status: String,
      executedAt: { type: Date, default: Date.now },
    },
  ],

  completed: { type: Boolean, default: false },
  completedAt: Date,
});


const DreamSchema = new Schema<DreamDocument>({
  userId: { type: String, required: true },
  dreamText: { type: String, required: true },
  intake: { type: Object, required: true },
  reflection: { type: Object, required: true },
  action: ActionSchema,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<DreamDocument>("Dream", DreamSchema);
