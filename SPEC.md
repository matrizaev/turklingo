# TurkLingo Analyzer - Technical Specification

## 1. Project Overview
**TurkLingo** is a pedagogical linguistic tool designed for learners and researchers of the Turkish language. It leverages the **Google Gemini 3 Pro** model to perform deep morphological analysis, translating complex agglutinative structures into human-readable explanations in either English or Russian.

## 2. Core Functionality
- **Morphological Analysis**: Breaks down Turkish words into their constituent parts (Root, Derivational Suffixes, Inflectional Suffixes).
- **Sentence Parsing**: Identifies Parts of Speech (POS) for every token in a sentence.
- **Vowel Harmony Detection**: Explains the logic behind suffix choices (2-way vs 4-way harmony).
- **Bilingual Interface**: Toggle between English and Russian for the entire UI and the AI-generated explanations.
- **Didactic Meaning**: Rather than a literal or literary translation, the app provides a "didactic meaning"—a pedagogical paraphrase that explains the grammatical intent and literal components of the phrase.
- **Analysis History**: Persists the last 10 analyses in the browser's local storage. Stored analyses are "frozen" in the language they were generated in to prevent re-translation drift.

## 3. Tech Stack
- **Frontend**: React 19 (ESM via esm.sh).
- **Styling**: Tailwind CSS (Custom color palette `turk` and `accent`).
- **AI Engine**: `@google/genai` (utilizing `gemini-3-pro-preview`).
- **Deployment**: Single-page application structure (`index.html` + `index.tsx`).

## 4. Architecture & Data Models

### 4.1 UI Localization (`UI_STRINGS`)
Stored in `constants.ts`, UI strings are mapped by language code (`en`, `ru`). Switching the UI language updates the `outputLanguage` in the AI configuration for future requests.

### 4.2 AI Integration & Schema
The app uses a strict JSON schema via Gemini's `responseSchema`.
- **Feature Canonicalization**: To prevent model drift, grammatical features are mapped to standard keys: `tense`, `aspect`, `mood`, `person`, `number`, `case`, `voice`, `polarity`, `evidentiality`.
- **Clitics & Particles**: Question particles (`mi`) and clitics (like `-de` vs. `da` or `-ki`) are treated as separate tokens or clearly identified attachments in the morphology chain.

### 4.3 Key Data Structures (`types.ts`)
- `AnalysisResult`: Root object containing `detected` info, `overview` (didactic meaning, sentence-level notes), and an array of `tokens`.
- `Token`: Contains `morphology` (root, derivation, inflection) and a `gloss`.

## 5. UI/UX Design Decisions
- **Color Coding**: POS → color mapping is handled via a documented constant in `constants.ts` to ensure visual consistency.
- **Progressive Disclosure**: In **Beginner Mode**, advanced phonological notes (like consonant softening logic) and deep derivational chains are collapsed or simplified to prevent cognitive overload.
- **Loading Skeletons**: Provides visual feedback during the 3-5 second analysis phase.

## 6. Security & Risks
- **Frontend API Key**: As a frontend-only educational tool, the Gemini API key is exposed in the client. This tool is intended for personal/educational use. Users should be aware of quota risks and rate limits associated with their Tier.

## 7. Linguistic Responsibility
- **Sentence vs Token**: Tense, mood, and global register are stored in the `overview`. Individual word morphology remains local to the `token` to ensure the breakdown remains granular and accurate.

## 8. Non-Goals
TurkLingo does **not** aim to provide:
- **Perfect Translation**: It is a learning tool, not a translation service (like DeepL).
- **Native Syntactic Parsing**: It focuses on morphology rather than complex dependency grammar.
- **Spoken Discourse Analysis**: It handles written grammar and formal/informal register but not conversational fillers or prosody.

## 9. Future Roadmap
- **Audio Synthesis**: Integration with Gemini TTS to hear the analyzed words.
- **Grammar Quizzes**: Generating practice questions based on the analyzed sentence.
