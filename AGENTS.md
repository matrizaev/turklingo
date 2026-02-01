# Repository Guidelines

## Project Structure & Module Organization

This application is built with React 19 and loads through `index.tsx`. The main UI logic and components are centralized in `index.tsx` for modular simplicity within the project root. Shared domain models are defined in `types.ts`, and localized UI strings, suffix data, and phonetic rules are managed in `constants.ts`. All AI-driven morphological analysis logic is encapsulated in `services/geminiService.ts`. The entry point and styling configuration reside in `index.html`.

## Development Context

This project uses ESM modules imported directly via `esm.sh` in the browser. There is no local build step required for development as it relies on standard web technologies and dynamic imports.

## Formatting & Naming Conventions

Use TypeScript with React functional components. Match the existing four-space indentation, single-quote imports, and PascalCase component names. Keep props and helper functions camelCased. Favor clear, declarative UI patterns using Tailwind CSS for all styling.

### React Craftsmanship Principles

- Build components that are focused, and predictable.
- Keep local state minimal; use hooks (`useState`, `useEffect`) effectively to manage UI transitions.
- Maintain a clear separation between linguistic data (in `constants.ts`) and UI rendering logic.
- Rely on TypeScript for type-safety throughout the analysis pipeline.
- Accessibility (a11y) is a priority; use semantic HTML and ARIA attributes where appropriate.

## Linguistic Analysis & AI Integration

- The core engine uses the `@google/genai` library with the `gemini-3-pro-preview` model.
- All morphological analysis must be didactic, providing pedagogical explanations rather than simple translations.
- System instructions for the AI are managed within `services/geminiService.ts`.
- The application handles two-way and four-way vowel harmony, as well as consonant alteration (KETÇAP) and assimilation (Fıstıkçı Şahap).

## Security & Configuration

- The application requires a valid Gemini API key.
- The API key is accessed exclusively via `process.env.API_KEY`.
- Never hardcode the API key or prompt the user for it within the UI.

## Testing & Quality

- Ensure the application is responsive and works across different screen sizes (mobile/desktop).
- Verify that both English and Russian localizations remain synchronized when adding new grammar rules.
- Maintain a performant UI by avoiding unnecessary re-renders during analysis.
