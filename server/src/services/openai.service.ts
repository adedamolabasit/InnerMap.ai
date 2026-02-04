import OpenAI from 'openai';
import 'dotenv/config';
import { trackOpenAI } from "opik-openai";

require('dotenv').config();

export const baseOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const openai = trackOpenAI(baseOpenAI);
