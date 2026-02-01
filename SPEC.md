# TurkLingo Analyzer - Technical Specification

## 1. Project Overview
**TurkLingo** is a pedagogical linguistic tool designed for learners and researchers of the Turkish language. It leverages the **Google Gemini 3 Pro** model to perform deep morphological analysis, translating complex agglutinative structures into human-readable explanations in either English or Russian.

## 2. Core Functionality
- **Dual-Mode Interface**:
  - **Analyzer Tab**: The primary tool for inputting Turkish text and receiving deep morphological breakdowns.
  - **Grammar Reference Tab**: A persistent, always-accessible library of Turkish suffix tables (Nouns, Verbs, Derivations) localized in English and Russian.
- **Morphological Analysis**: Breaks down Turkish words into their constituent parts (Root, Derivational Suffixes, Inflectional Suffixes).
- **Vowel Harmony Detection**: Explains the logic behind suffix choices (2-way vs 4-way harmony).
- **Didactic Meaning**: Provides a pedagogical paraphrase explaining the grammatical intent and literal components of phrases.
- **Analysis History**: Persists the last 10 analyses in the browser's local storage.

## 3. Tech Stack
- **Frontend**: React 19 (ESM via esm.sh).
- **Styling**: Tailwind CSS.
- **AI Engine**: `@google/genai` (utilizing `gemini-3-pro-preview`).

## 4. UI/UX Design Decisions
- **Persistent Navigation**: High-level tabs allow users to check grammar rules while their analysis is in progress or completed.
- **Color Coding**: Consistent POS → color mapping across the analyzer and reference tables.
- **Progressive Disclosure**: Advanced phonological notes are collapsed in Beginner Mode.

## 5. Linguistic Responsibility
- **Feature Canonicalization**: Uses standard keys: `tense`, `aspect`, `mood`, `person`, `number`, `case`, `voice`, `polarity`, `evidentiality`.
- **Clitics & Particles**: Treated as distinct components in the morphology chain.

## 6. Non-Goals
TurkLingo does **not** aim to provide:
- Perfect translation (it is a didactic tool).
- Native-level syntactic dependency parsing.
- Spoken discourse analysis.
