declare global {
  interface Window {
    __ENV?: {
      API_KEY?: string;
    };
  }
}

export const apiKey =
  window.__ENV?.API_KEY ?? process.env.API_KEY ?? "";
