import { GoogleGenAI } from "@google/genai";
import { AnalysisOptions, AnalysisResult } from "../types";
import { apiKey } from "../env";
import { buildAnalysisPrompt } from "./analysisPrompt";
import { geminiAnalysisSchema } from "./analysisSchema";

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzeText(
  text: string,
  options: AnalysisOptions,
): Promise<AnalysisResult> {
  if (!apiKey || !ai) {
    throw new Error("MISSING_API_KEY");
  }
  const modelId = "gemini-3-pro-preview";

  const systemPrompt = buildAnalysisPrompt(options);

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Analyze this input: "${text}"`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: geminiAnalysisSchema,
      temperature: 0.1,
    },
  });

  if (!response.text) throw new Error("Empty response from AI service.");

  try {
    return JSON.parse(response.text) as AnalysisResult;
  } catch (e) {
    throw new Error("Invalid JSON response from AI model.");
  }
}
