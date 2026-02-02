# TurkLingo Analyzer - Technical Specification

## 1. Project Overview

**TurkLingo** is a client-side, pedagogical Turkish morphology analyzer. It uses the **Google Gemini 3 Pro** model to produce a structured JSON analysis that the UI renders into learner-friendly explanations.

- **UI localization**: English and Russian (primary interface strings + reference tables).
- **Analysis output language** (sent to the model): English, Turkish, or Russian.

## 2. Core Functionality

- **Dual-mode top-level navigation**:
  - **Analyzer**: input + options + AI analysis results.
  - **Grammar Library**: phonetic rules and common suffix tables (localized EN/RU).
- **Analyzer workflow**:
  - Accepts single words and full sentences.
  - Options passed to the model: `beginnerFriendly`, `detailLevel`, `outputLanguage`.
  - Results are rendered in three tabs:
    - **Overview**: language detection (`tr` / `unknown`), sentence vs single-word flag, didactic meaning, optional sentence notes, optional common mistakes.
    - **Tokens**: per-token cards with POS badge (color-coded), lemma/root, optional IPA, morphology chain, derivation and inflection breakdown (with feature labels).
    - **Suffixes**: per-token morpheme chain visualization (root + derivation + inflection) with hover tooltips; optional per-token harmony/phonology notes.
  - Utility: copy the raw analysis JSON to clipboard.
- **Grammar Library contents**:
  - Vowel harmony reference tables (2-way and 4-way).
  - Consonant alternation/assimilation and buffer-letter references.
  - Suffix tables for nouns, verbs, and common derivations.
- **History**:
  - Stores up to 10 most recent analyses in `localStorage` (key: `turklingo_history`) and allows restoring an item into the analyzer.

## 3. Tech Stack

- **Frontend**: React 19 + TypeScript, bundled with Vite.
- **Styling**: Tailwind CSS (configured in `tailwind.config.js`) + base styles in `src/index.css`.
- **AI Engine**: `@google/genai` (model: `gemini-3-pro-preview`).

## 4. Architecture & Module Layout

- Entry: `index.html` mounts `src/main.tsx`.
- UI + state: `src/main.tsx` (single-file app).
- Domain types: `src/types.ts`.
- Localization + linguistic reference data: `src/constants.ts`.
- AI integration: `src/services/geminiService.ts`.

## 5. AI Integration Contract

- **Authentication**: API key is read as `process.env.API_KEY` (injected by Vite `define` from env files).
- **Request shape**:
  - `systemInstruction` enforces didactic meaning, output language, beginner-friendly behavior, detail level, clitic handling guidance, and returning empty arrays when a section is absent.
  - Response is requested as `application/json` and validated against a JSON schema (`responseSchema`).
- **Response (high level)**:
  - `input`, `detected` (`isSentence`, `language`), `overview`, `tokens[]` with `morphology` (`root`, `derivation[]`, `inflection[]`, `fullChain`, `vowelHarmony[]`, `pronunciationIpaApprox`).
- **Error handling**:
  - Empty AI responses and invalid JSON are surfaced to the UI with a retry action.

## 6. UI/UX Design Notes (Implemented)

- Persistent main navigation (Analyzer / Grammar Library).
- POS tags are color-coded in token cards; reference tables use category-specific accent colors (not POS mapping).
- Progressive disclosure: harmony/phonology notes in the Suffixes view start collapsed when `beginnerFriendly` is enabled.

## 7. Linguistic Responsibility

- **Feature canonicalization**: use standard keys such as `tense`, `aspect`, `mood`, `person`, `number`, `case`, `voice`, `polarity`, `evidentiality`.
- **Clitics & particles**: treat clitics/particles as separate tokens or clearly identified bound morphemes.

## 8. Known Implementation Gaps / Limitations

- The Options UI includes toggles for `showVowelHarmony` and `showIPA`, but they are not currently wired to rendering or to the model prompt.
- The analysis schema includes `rulesAndNotes` and `overview.meaningTurkish`, but these fields are not currently rendered in the UI.
- Not all user-facing strings are localized (e.g. some labels/alerts and service error messages are English-only).
- Gemini requests happen in the browser; embedding an API key is appropriate only for trusted environments. Public deployments should use a backend proxy.

## 9. Non-Goals

TurkLingo does **not** aim to provide:

- Perfect translation (it is a didactic tool).
- Native-level syntactic dependency parsing.
- Spoken discourse analysis.
