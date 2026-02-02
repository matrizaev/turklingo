export type AnalysisOptions = {
    beginnerFriendly: boolean;
    showVowelHarmony: boolean;
    showIPA: boolean;
    outputLanguage: 'English' | 'Turkish' | 'Russian';
    detailLevel: 'Brief' | 'Normal' | 'Deep';
};

export type AnalysisResult = {
    input: string;
    detected: {
        isSentence: boolean;
        language: "tr" | "unknown";
    };
    overview: {
        meaningEnglish?: string;
        meaningTurkish?: string;
        meaningTarget?: string; // For the requested output language if different
        register?: "formal" | "neutral" | "informal" | "unknown";
        sentenceNotes?: string[];
    };
    tokens: Array<{
        surface: string;
        lemma?: string;
        pos:
            | "NOUN" | "VERB" | "ADJ" | "ADV" | "PRON" | "DET" | "ADP"
            | "CONJ" | "PART" | "INTJ" | "NUM" | "PUNCT" | "X";
        morphology: {
            root?: string;
            derivation?: Array<{
                type: string;
                affix: string;
                explanation: string;
            }>;
            inflection?: Array<{
                category: string;
                affix: string;
                features: Record<string, string>;
                explanation: string;
            }>;
            fullChain?: string;
            vowelHarmony?: Array<{
                rule: "two-way" | "four-way" | "buffer-consonant" | "consonant-softening" | "other";
                explanation: string;
                appliesTo: string;
            }>;
            pronunciationIpaApprox?: string;
        };
        gloss?: string;
        notes?: string[];
    }>;
    rulesAndNotes?: string[];
    commonMistakes?: string[];
};

export type HistoryItem = {
    id: string;
    timestamp: number;
    input: string;
    result: AnalysisResult;
};
