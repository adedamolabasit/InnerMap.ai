import { Schema, model } from 'mongoose';

const DreamSchema = new Schema(
  {
    rawText: { type: String, required: true },
    editedText: { type: String },
    emotion: { type: String },
    themes: [String],
    insights: String
  },
  { timestamps: true }
);

export const Dream = model('Dream', DreamSchema);
