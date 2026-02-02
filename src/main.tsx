import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  DEFAULT_OPTIONS,
  EXAMPLE_INPUTS,
  CONSTRUCTOR_ROOTS,
  CONSTRUCTOR_SUFFIXES,
  POS_COLORS,
  UI_STRINGS,
  SUFFIX_DATA,
  PHONETIC_RULES,
} from "./constants";
import {
  AnalysisOptions,
  AnalysisResult,
  ConstructorPos,
  ConstructorSuffix,
  HistoryItem,
} from "./types";
import { analyzeText } from "./services/geminiService";
import { buildConstructedWord } from "./services/wordConstructor";
import "./index.css";

// --- Components ---

const Header = ({
  uiLang,
  setUiLang,
  t,
}: {
  uiLang: "en" | "ru";
  setUiLang: (l: "en" | "ru") => void;
  t: any;
}) => (
  <header className="bg-white border-b border-turk-200 sticky top-0 z-50">
    <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
          Tr
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {t.appTitle}
          </h1>
          <p className="text-xs text-slate-500 font-medium">{t.tagline}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setUiLang("en")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${uiLang === "en" ? "bg-white text-turk-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            EN
          </button>
          <button
            onClick={() => setUiLang("ru")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${uiLang === "ru" ? "bg-white text-turk-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            RU
          </button>
        </div>
        <a
          href="#"
          className="text-sm text-turk-600 hover:text-turk-800 font-medium transition-colors hidden sm:block"
          onClick={(e) => {
            e.preventDefault();
            alert(t.aboutMessage);
          }}
        >
          {t.about}
        </a>
      </div>
    </div>
  </header>
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
    <div className="h-32 bg-slate-200 rounded-xl"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-24 bg-slate-200 rounded-xl"></div>
      <div className="h-24 bg-slate-200 rounded-xl"></div>
      <div className="h-24 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

const ErrorDisplay = ({
  error,
  onRetry,
  t,
}: {
  error: string;
  onRetry: () => void;
  t: any;
}) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fadeIn">
    <div className="text-red-500 text-4xl mb-3">⚠️</div>
    <h3 className="text-lg font-semibold text-red-800 mb-2">
      {t.analysisFailed}
    </h3>
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
    >
      {t.tryAgain}
    </button>
  </div>
);

const Chip: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-turk-50 text-turk-700 hover:bg-turk-100 hover:text-turk-800 transition-colors border border-turk-100 cursor-pointer"
  >
    {label}
  </button>
);

const ToggleChip: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    aria-pressed={selected}
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
      selected
        ? "bg-accent-600 text-white border-accent-600"
        : "bg-white text-slate-600 border-slate-200 hover:border-accent-300 hover:text-accent-700"
    }`}
  >
    {label}
  </button>
);

const OptionsPanel = ({
  options,
  setOptions,
  isOpen,
  t,
}: {
  options: AnalysisOptions;
  setOptions: (o: AnalysisOptions) => void;
  isOpen: boolean;
  t: any;
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof AnalysisOptions) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm animate-fadeIn">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={options.beginnerFriendly}
          onChange={() => toggle("beginnerFriendly")}
          className="accent-accent-600 w-4 h-4"
        />
        <span className="text-slate-700">{t.beginnerFriendly}</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={options.showVowelHarmony}
          onChange={() => toggle("showVowelHarmony")}
          className="accent-accent-600 w-4 h-4"
        />
        <span className="text-slate-700">{t.showVowelHarmony}</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={options.showIPA}
          onChange={() => toggle("showIPA")}
          className="accent-accent-600 w-4 h-4"
        />
        <span className="text-slate-700">{t.showIPA}</span>
      </label>

      <div className="flex items-center gap-2">
        <span className="text-slate-700">{t.detailLevel}:</span>
        <select
          value={options.detailLevel}
          onChange={(e) =>
            setOptions({ ...options, detailLevel: e.target.value as any })
          }
          className="ml-auto bg-white border border-slate-300 rounded px-2 py-1 text-xs"
        >
          <option value="Brief">{t.detailLevelOptions.Brief}</option>
          <option value="Normal">{t.detailLevelOptions.Normal}</option>
          <option value="Deep">{t.detailLevelOptions.Deep}</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-700">{t.outputLanguage}:</span>
        <select
          value={options.outputLanguage}
          onChange={(e) =>
            setOptions({ ...options, outputLanguage: e.target.value as any })
          }
          className="ml-auto bg-white border border-slate-300 rounded px-2 py-1 text-xs"
        >
          <option value="English">{t.outputLanguageOptions.English}</option>
          <option value="Turkish">{t.outputLanguageOptions.Turkish}</option>
          <option value="Russian">{t.outputLanguageOptions.Russian}</option>
        </select>
      </div>
    </div>
  );
};

// --- Result Sub-Components ---

const OverviewTab = ({
  result,
  t,
  options,
}: {
  result: AnalysisResult;
  t: any;
  options: AnalysisOptions;
}) => (
  <div className="space-y-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
          {t.detectedLanguage}
        </h4>
        <p className="text-lg font-semibold text-indigo-900 capitalize">
          {result.detected.language === "tr" ? t.turkishLanguage : t.unknown}
          <span className="text-sm font-normal text-indigo-600 ml-2 opacity-75">
            ({result.detected.isSentence ? t.sentence : t.singleWord})
          </span>
        </p>
      </div>
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
          {t.meaning} ({options.outputLanguage})
        </h4>
        <p className="text-lg text-emerald-900 leading-snug">
          {result.overview.meaningTarget ||
            result.overview.meaningEnglish ||
            result.overview.meaningTurkish ||
            t.emptyPlaceholder}
        </p>
      </div>
    </div>

    {result.overview.sentenceNotes &&
      result.overview.sentenceNotes.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span>📝</span> {t.keyNotes}
          </h3>
          <ul className="space-y-2">
            {result.overview.sentenceNotes.map((note, idx) => (
              <li key={idx} className="text-slate-600 text-sm flex gap-2">
                <span className="text-accent-500 mt-1">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

    {result.commonMistakes && result.commonMistakes.length > 0 && (
      <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <span>⚠️</span> {t.commonMistakes}
        </h3>
        <ul className="space-y-2">
          {result.commonMistakes.map((mistake, idx) => (
            <li key={idx} className="text-amber-900 text-sm flex gap-2">
              <span className="text-amber-500 mt-1 font-bold">!</span>
              {mistake}
            </li>
          ))}
        </ul>
      </div>
    )}

    {result.rulesAndNotes && result.rulesAndNotes.length > 0 && (
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <span>📌</span> {t.rulesAndNotes}
        </h3>
        <ul className="space-y-2">
          {result.rulesAndNotes.map((note, idx) => (
            <li key={idx} className="text-slate-600 text-sm flex gap-2">
              <span className="text-accent-500 mt-1">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const TokenCard: React.FC<{
  token: AnalysisResult["tokens"][0];
  t: any;
  showIPA: boolean;
}> = ({ token, t, showIPA }) => {
  const posClass = POS_COLORS[token.pos] || POS_COLORS["X"];
  const localizedPos = t.posTags?.[token.pos] || token.pos;

  const tTerm = (term: any) => {
    if (typeof term !== "string") return String(term);
    const normalized = term.toLowerCase().trim();
    return t.grammaticalTerms?.[normalized] || term;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${posClass}`}
            >
              {localizedPos}
            </span>
            {showIPA && token.morphology.pronunciationIpaApprox && (
              <span className="text-xs text-slate-400 font-mono">
                /{token.morphology.pronunciationIpaApprox}/
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-800">{token.surface}</h3>
          <p className="text-sm text-slate-500 italic">
            {t.lemmaLabel}: {token.lemma || token.morphology.root}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">{token.gloss}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t.morphologyChain}
          </h4>
          <div className="flex flex-wrap items-center gap-1 text-sm font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
            {token.morphology.fullChain || token.surface}
          </div>
        </div>

        {token.morphology.inflection &&
          token.morphology.inflection.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.inflection}
              </h4>
              <div className="space-y-3">
                {token.morphology.inflection.map((inf, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-accent-600 bg-accent-50 px-1.5 py-0.5 rounded border border-accent-100">
                      {inf.affix}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-700">
                          {tTerm(inf.category)}:
                        </span>
                        <span className="text-slate-600">
                          {inf.explanation}
                        </span>
                      </div>
                      {inf.features && Object.keys(inf.features).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {Object.entries(inf.features).map(
                            ([k, v]) =>
                              v && (
                                <span
                                  key={k}
                                  className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 flex items-center gap-1"
                                >
                                  <span className="font-bold opacity-70">
                                    {tTerm(k)}:
                                  </span>
                                  <span>{tTerm(v)}</span>
                                </span>
                              ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {token.morphology.derivation &&
          token.morphology.derivation.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t.derivation}
              </h4>
              <div className="space-y-2">
                {token.morphology.derivation.map((der, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {der.affix}
                    </span>
                    <div>
                      <span className="font-bold text-slate-700 mr-2">
                        {tTerm(der.type)}:
                      </span>
                      <span className="text-slate-600">{der.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

const TokensTab = ({
  result,
  t,
  options,
}: {
  result: AnalysisResult;
  t: any;
  options: AnalysisOptions;
}) => (
  <div className="space-y-4 animate-fadeIn">
    {result.tokens.map((token, idx) => (
      <TokenCard key={idx} token={token} t={t} showIPA={options.showIPA} />
    ))}
  </div>
);

const SuffixBreakdownTab = ({
  result,
  t,
  options,
}: {
  result: AnalysisResult;
  t: any;
  options: AnalysisOptions;
}) => {
  const [showVowelHarmony, setShowVowelHarmony] = useState(
    options.showVowelHarmony && !options.beginnerFriendly,
  );

  useEffect(() => {
    setShowVowelHarmony(options.showVowelHarmony && !options.beginnerFriendly);
  }, [options.showVowelHarmony, options.beginnerFriendly]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {result.tokens.map((token, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
            {token.surface}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-slate-800 text-white px-3 py-2 rounded-lg font-mono font-bold shadow-sm">
                {token.morphology.root}
              </div>
              <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase">
                {t.root}
              </span>
            </div>

            {token.morphology.derivation?.map((d, i) => (
              <React.Fragment key={`d-${i}`}>
                <span className="text-slate-300 font-bold text-lg">+</span>
                <div className="flex flex-col items-center group relative cursor-help">
                  <div className="bg-indigo-100 text-indigo-900 px-3 py-2 rounded-lg font-mono font-semibold border border-indigo-200">
                    {d.affix}
                  </div>
                  <span className="text-[10px] text-indigo-500 font-bold mt-1 uppercase max-w-[60px] truncate text-center">
                    {d.type}
                  </span>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded w-48 z-10 text-center shadow-xl">
                    {d.explanation}
                  </div>
                </div>
              </React.Fragment>
            ))}

            {token.morphology.inflection?.map((inf, i) => (
              <React.Fragment key={`i-${i}`}>
                <span className="text-slate-300 font-bold text-lg">+</span>
                <div className="flex flex-col items-center group relative cursor-help">
                  <div className="bg-accent-50 text-accent-700 px-3 py-2 rounded-lg font-mono font-semibold border border-accent-100">
                    {inf.affix}
                  </div>
                  <span className="text-[10px] text-accent-500 font-bold mt-1 uppercase max-w-[60px] truncate text-center">
                    {inf.category}
                  </span>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded w-48 z-10 text-center shadow-xl">
                    {inf.explanation}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {options.showVowelHarmony &&
            token.morphology.vowelHarmony &&
            token.morphology.vowelHarmony.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowVowelHarmony(!showVowelHarmony)}
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 hover:text-slate-600 flex items-center gap-1 transition-colors"
                >
                  {t.harmonyRules} {showVowelHarmony ? "↑" : "↓"}
                </button>
                {showVowelHarmony && (
                  <div className="bg-slate-50 rounded-lg p-3 text-sm border border-slate-100 animate-fadeIn">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {token.morphology.vowelHarmony.map((h, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-turk-500 shrink-0"></div>
                          <div>
                            <span className="font-medium text-slate-800 block text-xs">
                              {h.rule.replace(/-/g, " ")}
                            </span>
                            <span className="text-slate-500 text-xs">
                              {h.explanation}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

const ReferenceTab = ({ uiLang, t }: { uiLang: "en" | "ru"; t: any }) => {
  const data = SUFFIX_DATA[uiLang];
  const rules = PHONETIC_RULES[uiLang];

  const Table = ({
    title,
    items,
    columns,
    renderRow,
  }: {
    title: string;
    items: any[];
    columns: string[];
    renderRow: (item: any, i: number) => React.ReactNode;
  }) => (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
        {title}
      </h3>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-3 font-bold text-slate-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, i) => renderRow(item, i))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn space-y-6 max-w-5xl mx-auto px-4 py-4">
      {/* Vowel Harmony Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Table
            title={`${t.ref.vowelHarmony} (2-way / A-type)`}
            items={rules.vowelTwoWay}
            columns={[t.ref.trigger, t.ref.result, t.ref.example]}
            renderRow={(item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-accent-600">
                  {item.trigger}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-slate-700">
                  → {item.result}
                </td>
                <td className="px-4 py-3 text-slate-500 italic">
                  {item.examples}
                </td>
              </tr>
            )}
          />
        </div>
        <div>
          <Table
            title={`${t.ref.vowelHarmony} (4-way / I-type)`}
            items={rules.vowelFourWay}
            columns={[t.ref.trigger, t.ref.result, t.ref.example]}
            renderRow={(item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-accent-600">
                  {item.trigger}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-slate-700">
                  → {item.result}
                </td>
                <td className="px-4 py-3 text-slate-500 italic">
                  {item.examples}
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {/* Consonant Rules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Table
            title={t.ref.consonantAlteration}
            items={rules.consonantsSoftening}
            columns={[t.ref.change, t.ref.meaning, t.ref.example]}
            renderRow={(item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-emerald-600">
                  {item.change}
                </td>
                <td className="px-4 py-3 text-slate-700">{item.context}</td>
                <td className="px-4 py-3 text-slate-500 italic font-mono">
                  {item.example}
                </td>
              </tr>
            )}
          />
        </div>
        <div>
          <Table
            title={t.ref.consonantAssimilation}
            items={rules.consonantsAssimilation}
            columns={[t.ref.change, t.ref.meaning, t.ref.example]}
            renderRow={(item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-amber-600">
                  {item.change}
                </td>
                <td className="px-4 py-3 text-slate-700">{item.context}</td>
                <td className="px-4 py-3 text-slate-500 italic font-mono">
                  {item.example}
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {/* Buffer Letters Section */}
      <div className="grid grid-cols-1 gap-8">
        <Table
          title={t.ref.bufferLetters}
          items={rules.bufferLetters}
          columns={[t.ref.letter, t.ref.meaning, t.ref.example]}
          renderRow={(item, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-bold text-accent-600 text-xl">
                {item.letter}
              </td>
              <td className="px-4 py-3 text-slate-700">{item.context}</td>
              <td className="px-4 py-3 text-slate-500 italic font-mono">
                {item.example}
              </td>
            </tr>
          )}
        />
      </div>

      {/* Vowel Drop Section */}
      <div className="grid grid-cols-1 gap-8">
        <Table
          title={t.ref.vowelDrop}
          items={rules.vowelDrop}
          columns={[t.ref.change, t.ref.meaning, t.ref.example]}
          renderRow={(item, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-bold text-rose-600">
                {item.change}
              </td>
              <td className="px-4 py-3 text-slate-700">{item.context}</td>
              <td className="px-4 py-3 text-slate-500 italic font-mono">
                {item.example}
              </td>
            </tr>
          )}
        />
      </div>

      {/* Grammatical Suffixes Section */}
      <div className="border-t border-slate-200 pt-8 mt-8">
        <Table
          title={t.ref.nouns}
          items={data.nouns}
          columns={[t.ref.suffix, t.ref.meaning, t.ref.example]}
          renderRow={(item, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-mono text-accent-600 font-bold whitespace-nowrap">
                {item.s}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {t.ref[item.cat]}
                </span>
                {item.m}
              </td>
              <td className="px-4 py-3 text-slate-500 italic">{item.e}</td>
            </tr>
          )}
        />
        <Table
          title={t.ref.verbs}
          items={data.verbs}
          columns={[t.ref.suffix, t.ref.meaning, t.ref.example]}
          renderRow={(item, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-mono text-accent-600 font-bold whitespace-nowrap">
                {item.s}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {t.ref[item.cat]}
                </span>
                {item.m}
              </td>
              <td className="px-4 py-3 text-slate-500 italic">{item.e}</td>
            </tr>
          )}
        />
        <Table
          title={t.ref.derivations}
          items={data.derivations}
          columns={[t.ref.suffix, t.ref.meaning, t.ref.example]}
          renderRow={(item, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-mono text-accent-600 font-bold whitespace-nowrap">
                {item.s}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {t.ref[item.cat]}
                </span>
                {item.m}
              </td>
              <td className="px-4 py-3 text-slate-500 italic">{item.e}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

const ConstructorTab = ({
  uiLang,
  t,
  options,
  pos,
  onPosChange,
  rootId,
  onRootChange,
  suffixIds,
  setSuffixIds,
  result,
  setResult,
  error,
  setError,
  loading,
  setLoading,
  cache,
  setCache,
}: {
  uiLang: "en" | "ru";
  t: any;
  options: AnalysisOptions;
  pos: ConstructorPos;
  onPosChange: (pos: ConstructorPos) => void;
  rootId: string;
  onRootChange: (id: string) => void;
  suffixIds: string[];
  setSuffixIds: (ids: string[]) => void;
  result: AnalysisResult | null;
  setResult: (res: AnalysisResult | null) => void;
  error: string | null;
  setError: (value: string | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  cache: Record<string, AnalysisResult>;
  setCache: (next: Record<string, AnalysisResult>) => void;
}) => {
  const roots = CONSTRUCTOR_ROOTS.filter((root) => root.pos === pos);
  const suffixes = CONSTRUCTOR_SUFFIXES.filter((suffix) => suffix.pos === pos);

  const selectedRoot = roots.find((root) => root.id === rootId) ?? roots[0];
  const rootGloss =
    uiLang === "ru" ? selectedRoot?.glossRu : selectedRoot?.glossEn;

  const suffixIndex = useMemo(() => {
    const indexMap: Record<string, number> = {};
    CONSTRUCTOR_SUFFIXES.forEach((suffix, index) => {
      indexMap[suffix.id] = index;
    });
    return indexMap;
  }, []);

  const selectedSuffixes = useMemo(
    () =>
      suffixIds
        .map((id) => CONSTRUCTOR_SUFFIXES.find((suffix) => suffix.id === id))
        .filter(Boolean) as ConstructorSuffix[],
    [suffixIds],
  );

  const orderedSuffixes = useMemo(() => {
    return [...selectedSuffixes].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return (suffixIndex[a.id] ?? 0) - (suffixIndex[b.id] ?? 0);
    });
  }, [selectedSuffixes, suffixIndex]);

  const { surface, chain } = useMemo(() => {
    return buildConstructedWord(selectedRoot?.root ?? "", orderedSuffixes);
  }, [selectedRoot?.root, orderedSuffixes]);

  const categoryOrder: Record<ConstructorPos, string[]> = {
    NOUN: ["plural", "possessive", "cases"],
    VERB: ["tenses", "person"],
    ADJ: ["derivation"],
  };

  const groupedSuffixes = categoryOrder[pos].map((category) => ({
    category,
    items: suffixes.filter((suffix) => suffix.category === category),
  }));

  const singleSelectCategories: Record<ConstructorPos, string[]> = {
    NOUN: ["plural", "possessive", "cases"],
    VERB: ["tenses", "person"],
    ADJ: ["derivation"],
  };

  const suffixById = useMemo(() => {
    const indexMap: Record<string, ConstructorSuffix> = {};
    CONSTRUCTOR_SUFFIXES.forEach((suffix) => {
      indexMap[suffix.id] = suffix;
    });
    return indexMap;
  }, []);

  const toggleSuffix = (suffixId: string) => {
    if (suffixIds.includes(suffixId)) {
      setSuffixIds(suffixIds.filter((id) => id !== suffixId));
      return;
    }
    const nextSuffix = suffixById[suffixId];
    if (!nextSuffix) return;

    let nextIds = [...suffixIds];
    if (singleSelectCategories[pos].includes(nextSuffix.category)) {
      nextIds = nextIds.filter((id) => {
        const existing = suffixById[id];
        return existing?.category !== nextSuffix.category;
      });
    }
    setSuffixIds([...nextIds, suffixId]);
  };

  const clearSelection = () => {
    setSuffixIds([]);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!surface) return;
    const cacheKey = [
      surface,
      options.outputLanguage,
      options.detailLevel,
      options.beginnerFriendly,
      options.showVowelHarmony,
    ].join("::");
    if (cache[cacheKey]) {
      setResult(cache[cacheKey]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeText(surface, options);
      setResult(data);
      setCache({ ...cache, [cacheKey]: data });
    } catch (err: any) {
      if (err?.message === "MISSING_API_KEY") {
        setError(t.errors.missingApiKey);
      } else {
        setError(t.errors.generic);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {t.constructor.title}
          </h2>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t.constructor.posLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {(["NOUN", "VERB", "ADJ"] as ConstructorPos[]).map(
                (posOption) => (
                  <ToggleChip
                    key={posOption}
                    label={t.constructor.posOptions[posOption]}
                    selected={posOption === pos}
                    onClick={() => onPosChange(posOption)}
                  />
                ),
              )}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="constructor-root"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              {t.constructor.rootLabel}
            </label>
            <select
              id="constructor-root"
              value={selectedRoot?.id ?? ""}
              onChange={(e) => onRootChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              {roots.map((root) => (
                <option key={root.id} value={root.id}>
                  {root.root} — {uiLang === "ru" ? root.glossRu : root.glossEn}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-2">
              {t.constructor.rootHint}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700">
                {t.constructor.suffixesLabel}
              </h3>
              <button
                onClick={clearSelection}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                {t.constructor.clear}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {t.constructor.orderHint}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              {t.constructor.contractionHint}
            </p>
            <div className="space-y-4">
              {groupedSuffixes.map((group) => (
                <div key={group.category}>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                    {t.constructor.categories[group.category]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((suffix) => (
                      <ToggleChip
                        key={suffix.id}
                        label={
                          uiLang === "ru" ? suffix.labelRu : suffix.labelEn
                        }
                        selected={suffixIds.includes(suffix.id)}
                        onClick={() => toggleSuffix(suffix.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!surface || loading}
              className="bg-accent-600 hover:bg-accent-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors"
            >
              {loading ? t.analyzing : t.constructor.analyze}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(surface)}
              disabled={!surface}
              className="bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 disabled:text-slate-300 disabled:border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              {t.constructor.copy}
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            {t.constructor.preview}
          </h3>

          {!surface && (
            <p className="text-slate-400 mt-4">{t.constructor.emptyPreview}</p>
          )}

          {surface && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  {t.constructor.rootLabel}
                </p>
                <div className="text-2xl font-bold text-slate-800">
                  {surface}
                </div>
                {selectedRoot && (
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedRoot.root} · {rootGloss}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {t.constructor.chain}
                </p>
                <p className="text-sm text-slate-700">{chain}</p>
              </div>

              {result && (
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {t.constructor.appliedRules}
                  </p>
                  {result.tokens?.[0]?.morphology?.vowelHarmony?.length ? (
                    <div className="space-y-3 text-xs text-slate-500">
                      {result.tokens[0].morphology.vowelHarmony.map(
                        (item, idx) => (
                          <div key={`${item.rule}-${idx}`}>
                            <p className="font-semibold text-slate-500">
                              {item.rule}
                            </p>
                            <p className="mt-1">{item.explanation}</p>
                            <p className="mt-1 text-slate-400">
                              {item.appliesTo}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {t.emptyPlaceholder}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t.constructor.meaning}
            </h4>
            {loading && <LoadingSkeleton />}
            {error && (
              <ErrorDisplay error={error} onRetry={handleAnalyze} t={t} />
            )}
            {!loading && !error && (
              <p className="text-sm text-slate-600">
                {result?.overview?.meaningTarget ||
                  result?.overview?.meaningEnglish ||
                  result?.overview?.meaningTurkish ||
                  t.constructor.emptyMeaning}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const ResultDisplay = ({
  result,
  t,
  options,
}: {
  result: AnalysisResult;
  t: any;
  options: AnalysisOptions;
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "tokens" | "suffix">(
    "overview",
  );

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    alert(t.copyJsonSuccess);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slideUp">
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-thin">
        {[
          { id: "overview", label: t.tabs.overview },
          { id: "tokens", label: t.tabs.tokens },
          { id: "suffix", label: t.tabs.suffix },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-accent-600 border-b-2 border-accent-600 bg-accent-50/10"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button
          onClick={copyJSON}
          className="px-4 py-4 text-xs font-semibold text-slate-400 hover:text-slate-600 border-l border-slate-100 transition-colors uppercase tracking-wider"
        >
          {t.copyJson}
        </button>
      </div>

      <div className="p-6 bg-slate-50/50 min-h-[400px]">
        {activeTab === "overview" && (
          <OverviewTab result={result} t={t} options={options} />
        )}
        {activeTab === "tokens" && (
          <TokensTab result={result} t={t} options={options} />
        )}
        {activeTab === "suffix" && (
          <SuffixBreakdownTab result={result} t={t} options={options} />
        )}
      </div>
    </div>
  );
};

const HistoryPanel = ({
  history,
  onSelect,
  t,
}: {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  t: any;
}) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        {t.history}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="text-left bg-white p-3 rounded-lg border border-slate-200 hover:border-turk-300 hover:shadow-md transition-all group animate-slideUp"
          >
            <div className="font-medium text-slate-800 truncate group-hover:text-turk-700">
              {item.input}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex justify-between">
              <span>
                {item.result.detected.isSentence ? t.sentence : t.singleWord}
              </span>
              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [inputText, setInputText] = useState("");
  const [options, setOptions] = useState<AnalysisOptions>(DEFAULT_OPTIONS);
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [uiLang, setUiLang] = useState<"en" | "ru">("en");
  const [activeMainTab, setActiveMainTab] = useState<
    "analyzer" | "constructor" | "reference"
  >("analyzer");
  const [constructorPos, setConstructorPos] = useState<ConstructorPos>("NOUN");
  const [constructorRootId, setConstructorRootId] = useState(() => {
    return CONSTRUCTOR_ROOTS.find((root) => root.pos === "NOUN")?.id ?? "";
  });
  const [constructorSuffixIds, setConstructorSuffixIds] = useState<string[]>(
    [],
  );
  const [constructorResult, setConstructorResult] =
    useState<AnalysisResult | null>(null);
  const [constructorError, setConstructorError] = useState<string | null>(null);
  const [constructorLoading, setConstructorLoading] = useState(false);
  const [constructorCache, setConstructorCache] = useState<
    Record<string, AnalysisResult>
  >({});

  const t = UI_STRINGS[uiLang];

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      outputLanguage: uiLang === "ru" ? "Russian" : "English",
    }));
  }, [uiLang]);

  useEffect(() => {
    const saved = localStorage.getItem("turklingo_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    setConstructorResult(null);
    setConstructorError(null);
  }, [
    constructorPos,
    constructorRootId,
    constructorSuffixIds.join("|"),
    options.outputLanguage,
    options.detailLevel,
    options.beginnerFriendly,
    options.showVowelHarmony,
    uiLang,
  ]);

  const saveToHistory = (res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      input: res.input,
      result: res,
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("turklingo_history", JSON.stringify(newHistory));
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeText(inputText, options);
      setResult(data);
      saveToHistory(data);
    } catch (err: any) {
      if (err?.message === "MISSING_API_KEY") {
        setError(t.errors.missingApiKey);
      } else {
        setError(t.errors.generic);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setInputText(item.input);
    setResult(item.result);
    setActiveMainTab("analyzer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConstructorPosChange = (nextPos: ConstructorPos) => {
    if (nextPos === constructorPos) return;
    setConstructorPos(nextPos);
    const nextRoot =
      CONSTRUCTOR_ROOTS.find((root) => root.pos === nextPos)?.id ?? "";
    setConstructorRootId(nextRoot);
    setConstructorSuffixIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header uiLang={uiLang} setUiLang={setUiLang} t={t} />

      {/* Main Persistent Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveMainTab("analyzer")}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeMainTab === "analyzer" ? "border-accent-600 text-accent-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {t.mainTabs.analyzer}
          </button>
          <button
            onClick={() => setActiveMainTab("constructor")}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeMainTab === "constructor" ? "border-accent-600 text-accent-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {t.mainTabs.constructor}
          </button>
          <button
            onClick={() => setActiveMainTab("reference")}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeMainTab === "reference" ? "border-accent-600 text-accent-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {t.mainTabs.reference}
          </button>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8">
        {activeMainTab === "analyzer" && (
          <div className="animate-fadeIn">
            <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-slate-100">
              <label
                htmlFor="input"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                {t.inputLabel}
              </label>
              <div className="relative">
                <textarea
                  id="input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="w-full h-32 p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-turk-400 focus:ring-0 transition-all resize-none placeholder-slate-300"
                />
                {inputText && (
                  <button
                    onClick={() => setInputText("")}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                    title={t.clear}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_INPUTS.slice(0, 3).map((ex) => (
                    <Chip
                      key={ex}
                      label={ex}
                      onClick={() => setInputText(ex)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-slate-500 hover:text-slate-700 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {showOptions ? t.hideOptions : t.options}
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !inputText.trim()}
                    className="flex-grow md:flex-grow-0 bg-accent-600 hover:bg-accent-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-accent-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? t.analyzing : t.analyze}
                  </button>
                </div>
              </div>
              <OptionsPanel
                options={options}
                setOptions={setOptions}
                isOpen={showOptions}
                t={t}
              />
            </section>

            {error && (
              <ErrorDisplay error={error} onRetry={handleAnalyze} t={t} />
            )}
            {isLoading && <LoadingSkeleton />}
            {!isLoading && result && (
              <ResultDisplay result={result} t={t} options={options} />
            )}
            <HistoryPanel
              history={history}
              onSelect={restoreHistoryItem}
              t={t}
            />
          </div>
        )}

        {activeMainTab === "constructor" && (
          <ConstructorTab
            uiLang={uiLang}
            t={t}
            options={options}
            pos={constructorPos}
            onPosChange={handleConstructorPosChange}
            rootId={constructorRootId}
            onRootChange={setConstructorRootId}
            suffixIds={constructorSuffixIds}
            setSuffixIds={setConstructorSuffixIds}
            result={constructorResult}
            setResult={setConstructorResult}
            error={constructorError}
            setError={setConstructorError}
            loading={constructorLoading}
            setLoading={setConstructorLoading}
            cache={constructorCache}
            setCache={setConstructorCache}
          />
        )}

        {activeMainTab === "reference" && (
          <ReferenceTab uiLang={uiLang} t={t} />
        )}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-400 text-sm mt-auto">
        <p>{t.footer.replace("{year}", new Date().getFullYear().toString())}</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

export default App;
