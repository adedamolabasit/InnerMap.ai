import { openaiOpik } from "../services/opik";

type DreamAnalysisResult = {
  themes: string[];
  insights: string;
};

export const analyzeDreamAgent = async (
  dreamText: string,
): Promise<DreamAnalysisResult> => {
  const response = await openaiOpik.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
You are a calm, reflective assistant.
You MUST return valid JSON only.
No markdown.
No explanation.
`,
      },
      {
        role: "user",
        content: `
Analyze the dream below.

Return JSON with EXACTLY this shape:
{
  "themes": string[],
  "insights": string
}

Dream:
${dreamText}
`,
      },
    ],
  });

  const raw = response.output_text;
  await openaiOpik.flush();
  try {
    return JSON.parse(raw) as DreamAnalysisResult;
  } catch {
    throw new Error("Dream agent returned invalid JSON");
  }
};
