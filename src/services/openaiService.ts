import OpenAI from "openai";
import { AnalysisOptions, AnalysisResult } from "../types";
import { apiKey } from "../env";
import { buildAnalysisPrompt } from "./analysisPrompt";
import { openAiAnalysisSchema } from "./analysisSchema";

const client = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

export async function analyzeText(
  text: string,
  options: AnalysisOptions,
): Promise<AnalysisResult> {
  if (!apiKey || !client) {
    throw new Error("MISSING_API_KEY");
  }

  const systemPrompt = buildAnalysisPrompt(options, { enforceJson: true });

  const response = await client.chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analyze this input: "${text}"` },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "analysis_result",
        schema: openAiAnalysisSchema,
        strict: false,
      },
    },
    temperature: 0.1,
  });

  const responseText = response.choices?.[0]?.message?.content ?? "";

  if (!responseText) {
    throw new Error("Empty response from AI service.");
  }

  try {
    return JSON.parse(responseText) as AnalysisResult;
  } catch (e) {
    throw new Error("Invalid JSON response from AI model.");
  }
}
