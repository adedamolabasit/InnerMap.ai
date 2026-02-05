import { trackOpenAI } from "opik-openai";
import { baseOpenAI } from "./openai.service";
import { Opik } from "opik";
import 'dotenv/config';


require('dotenv').config();

export const openaiOpik = trackOpenAI(baseOpenAI);

export const openaiOpikThread = new Opik({
  apiUrl: "https://www.comet.com/opik/api", 
  apiKey: process.env.OPIK_API_KEY,
  projectName: "innermind-agent",
  workspaceName: "innermind", 
});
