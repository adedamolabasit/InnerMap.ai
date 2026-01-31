import mongoose, { Schema, Document, Types } from "mongoose";
import {
  DreamIntakeResult,
  ReflectionResult,
  ActionAgentResult,
} from "../agents/types";
import { StoredAction } from "./types";

export interface DreamDocument extends Document {
  userId: Types.ObjectId;
  dreamText: string;
  intake: DreamIntakeResult;
  reflection: ReflectionResult;
  action: StoredAction;
  createdAt: Date;
  todoistAccessToken: string;
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dreamText: { type: String, required: true },
  intake: { type: Object, required: true },
  reflection: { type: Object, required: true },
  action: ActionSchema,
  createdAt: { type: Date, default: Date.now },
  todoistAccessToken: { type: String, required: false },
});

export default mongoose.model<DreamDocument>("Dream", DreamSchema);
