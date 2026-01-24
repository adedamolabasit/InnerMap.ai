import { Schema, model } from 'mongoose';

const ActionSchema = new Schema(
  {
    dreamId: { type: Schema.Types.ObjectId, ref: 'Dream' },
    type: { type: String, enum: ['todo', 'goal', 'reflect'] },
    content: String,
    duration: String
  },
  { timestamps: true }
);

export const Action = model('Action', ActionSchema);
