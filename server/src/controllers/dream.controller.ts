import { Request, Response } from 'express';
import { Dream } from '../models/Dream';
import { Action } from '../models/Action';
import { analyzeDreamAgent } from '../agents/dreamAnalysis.agent';
import { actionAgent } from '../agents/actionAgent';

export const submitDream = async (req: Request, res: Response) => {
  const { text, emotion } = req.body;

  const dream = await Dream.create({
    rawText: text,
    editedText: text,
    emotion
  });

  const analysis = await analyzeDreamAgent(text);

  dream.themes = analysis.themes;
  dream.insights = analysis.insights;
  await dream.save();

  const action = await actionAgent(analysis.themes);

  const savedAction = await Action.create({
    dreamId: dream._id,
    ...action
  });

  res.json({
    dream,
    action: savedAction
  });
};
