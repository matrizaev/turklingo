import { AiBackend } from "./types";

declare global {
  interface Window {
    __ENV?: {
      API_KEY?: string;
      AI_BACKEND?: string;
    };
  }
}

export const apiKey = window.__ENV?.API_KEY ?? process.env.API_KEY ?? "";
const aiBackendRaw =
  window.__ENV?.AI_BACKEND ?? process.env.AI_BACKEND ?? "gemini";

export const aiBackend: AiBackend =
  aiBackendRaw === "openai" ? "openai" : "gemini";

if (typeof window !== "undefined") {
  console.info(`[TurkLingo] AI_BACKEND=${aiBackend}`);
}
