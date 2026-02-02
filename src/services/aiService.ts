import { AnalysisOptions, AnalysisResult } from "../types";
import { aiBackend } from "../env";
import { analyzeText as analyzeWithGemini } from "./geminiService";
import { analyzeText as analyzeWithOpenAi } from "./openaiService";

export async function analyzeText(
  text: string,
  options: AnalysisOptions,
): Promise<AnalysisResult> {
  if (aiBackend === "openai") {
    return analyzeWithOpenAi(text, options);
  }

  return analyzeWithGemini(text, options);
}
