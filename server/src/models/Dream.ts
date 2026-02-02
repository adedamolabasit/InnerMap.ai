import mongoose, { Schema, Document, Types } from "mongoose";
import {
  DreamIntakeResult,
  ReflectionResult,
} from "../agents/types";
import { StoredAction } from "./types";

export interface DreamDocument extends Document {
  userId: Types.ObjectId;
  dreamText: string;
  intake?: DreamIntakeResult | null;
  reflection?: ReflectionResult | null;
  action?: StoredAction | null;
  todoisUrl: string;
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
  todoisUrl: { type: String, required: false },
  dreamText: { type: String, required: true },
  intake: { type: Object, required: false },
  reflection: { type: Object, required: false },
  action: ActionSchema,
  createdAt: { type: Date, default: Date.now },
  todoistAccessToken: { type: String, required: false },
});

export default mongoose.model<DreamDocument>("Dream", DreamSchema);
