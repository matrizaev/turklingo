#+ Plans

## Refactor: Selectable AI Backend (OpenAI GPT-5.2 vs Gemini)

### Goals

- Allow choosing AI backend via a new environment variable (default to current Gemini behavior).
- Keep API key handling secure (`process.env` only).
- Preserve didactic morphological explanations and existing UI behavior.

### Proposed Steps

1. **Define config and types**
   - Add a typed `AI_BACKEND` union (e.g., `"gemini" | "openai"`) in `src/types.ts`.
   - Add a single config resolver (e.g., `getAiBackend()` in `src/constants.ts` or a new `src/config.ts`) that reads `process.env` and provides a default.

2. **Create OpenAI service module**
   - Implement `src/services/openaiService.ts` mirroring the `geminiService.ts` public API.
   - Use the `@openai/*` SDK (exact package to be confirmed) and model `gpt-5.2` with the same system instructions used by Gemini.

3. **Introduce service selector**
   - Add a lightweight dispatcher (e.g., `src/services/aiService.ts`) that chooses the active backend based on `AI_BACKEND`.
   - Ensure the selected service returns the same response shape as Gemini to avoid UI changes.

4. **Wire UI to the selector**
   - Update `src/main.tsx` to use the new `aiService` entrypoint instead of `geminiService` directly.
   - Keep component state and rendering logic unchanged.

5. **Update environment documentation**
   - Document `AI_BACKEND` (allowed values and default) in `README.md` (and `SPEC.md` if needed).
   - Ensure no API key is ever surfaced in UI text.

6. **Regression checks**
   - Run `npm run format` and `npm run lint`.
   - Verify both English and Russian localization output remains aligned for any new/changed strings.

### Open Questions

- None.
