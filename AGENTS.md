# Repository Guidelines

## Project Structure & Module Organization

This application is built with React 19 and loads through `src/main.tsx`. The main UI logic and components are centralized in `src/main.tsx` for modular simplicity within the `src` folder. Shared domain models are defined in `src/types.ts`, and localized UI strings, suffix data, and phonetic rules are managed in `src/constants.ts`. All AI-driven morphological analysis logic is encapsulated in `src/services/geminiService.ts`. The HTML entry point resides in `index.html`, with styling defined in `src/index.css` and Tailwind configuration in `tailwind.config.js`.

## Development Context

This project is a Vite app using ESM. Run `npm run dev` for local development and `npm run build` for production builds.

## Formatting & Naming Conventions

Use TypeScript with React functional components. Match the existing two-space indentation, double-quote imports, and PascalCase component names. Keep props and helper functions camelCased. Favor clear, declarative UI patterns using Tailwind CSS for all styling.

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
