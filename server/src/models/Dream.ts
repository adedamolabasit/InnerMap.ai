import mongoose, { Schema, Document } from 'mongoose';
import { DreamIntakeResult, ReflectionResult, ActionAgentResult } from '../agents/types';

export interface DreamDocument extends Document {
  userId: string;
  dreamText: string;
  intake: DreamIntakeResult;
  reflection: ReflectionResult;
  action: ActionAgentResult;
  createdAt: Date;
}

const DreamSchema = new Schema<DreamDocument>({
  userId: { type: String, required: true },
  dreamText: { type: String, required: true },
  intake: { type: Object, required: true },
  reflection: { type: Object, required: true },
  action: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<DreamDocument>('Dream', DreamSchema);
