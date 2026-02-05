import OpenAI from 'openai';
import 'dotenv/config';


require('dotenv').config();

export const baseOpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


