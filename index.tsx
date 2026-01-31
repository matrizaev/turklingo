import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_OPTIONS, EXAMPLE_INPUTS, POS_COLORS } from "./constants";
import { AnalysisOptions, AnalysisResult, HistoryItem } from "./types";
import { analyzeText } from "./services/geminiService";

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-turk-200 sticky top-0 z-50">
    <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
          Tr
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">TurkLingo</h1>
          <p className="text-xs text-slate-500 font-medium">AI Grammar & Morphology Analyzer</p>
        </div>
      </div>
      <a 
        href="#" 
        className="text-sm text-turk-600 hover:text-turk-800 font-medium transition-colors"
        onClick={(e) => { e.preventDefault(); alert("TurkLingo v1.0\nPowered by Google Gemini"); }}
      >
        About
      </a>
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

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <div className="text-red-500 text-4xl mb-3">⚠️</div>
    <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
    <p className="text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Explicitly type as React.FC to allow 'key' prop in lists if needed, though mostly used directly
const Chip: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-turk-50 text-turk-700 hover:bg-turk-100 hover:text-turk-800 transition-colors border border-turk-100 cursor-pointer"
  >
    {label}
  </button>
);

const OptionsPanel = ({ options, setOptions, isOpen }: { options: AnalysisOptions; setOptions: (o: AnalysisOptions) => void; isOpen: boolean }) => {
  if (!isOpen) return null;

  const toggle = (key: keyof AnalysisOptions) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm animate-fadeIn">
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={options.beginnerFriendly} onChange={() => toggle('beginnerFriendly')} className="accent-accent-600 w-4 h-4" />
        <span className="text-slate-700">Beginner-friendly explanations</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={options.showVowelHarmony} onChange={() => toggle('showVowelHarmony')} className="accent-accent-600 w-4 h-4" />
        <span className="text-slate-700">Show vowel harmony rules</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={options.showIPA} onChange={() => toggle('showIPA')} className="accent-accent-600 w-4 h-4" />
        <span className="text-slate-700">Show IPA pronunciation</span>
      </label>
      
      <div className="flex items-center gap-2">
        <span className="text-slate-700">Detail Level:</span>
        <select 
          value={options.detailLevel} 
          onChange={(e) => setOptions({...options, detailLevel: e.target.value as any})}
          className="ml-auto bg-white border border-slate-300 rounded px-2 py-1 text-xs"
        >
          <option>Brief</option>
          <option>Normal</option>
          <option>Deep</option>
        </select>
      </div>
    </div>
  );
};

// --- Result Sub-Components ---

const OverviewTab = ({ result }: { result: AnalysisResult }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Detected Language</h4>
        <p className="text-lg font-semibold text-indigo-900 capitalize">
          {result.detected.language === 'tr' ? 'Turkish 🇹🇷' : 'Unknown'} 
          <span className="text-sm font-normal text-indigo-600 ml-2 opacity-75">
            ({result.detected.isSentence ? 'Sentence' : 'Single Word'})
          </span>
        </p>
      </div>
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Meaning ({DEFAULT_OPTIONS.outputLanguage})</h4>
        <p className="text-lg text-emerald-900">{result.overview.meaningEnglish || "—"}</p>
      </div>
    </div>

    {result.overview.sentenceNotes && result.overview.sentenceNotes.length > 0 && (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <span>📝</span> Key Grammatical Notes
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
          <span>⚠️</span> Common Mistakes
        </h3>
        <ul className="space-y-2">
          {result.commonMistakes.map((mistake, idx) => (
            <li key={idx} className="text-amber-900 text-sm flex gap-2">
              <span className="text-amber-500 mt-1">!</span>
              {mistake}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const TokenCard: React.FC<{ token: AnalysisResult['tokens'][0] }> = ({ token }) => {
  const posClass = POS_COLORS[token.pos] || POS_COLORS['X'];
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${posClass}`}>
              {token.pos}
            </span>
            {token.morphology.pronunciationIpaApprox && (
              <span className="text-xs text-slate-400 font-mono">/{token.morphology.pronunciationIpaApprox}/</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-800">{token.surface}</h3>
          <p className="text-sm text-slate-500 italic">Lemma: {token.lemma || token.morphology.root}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">{token.gloss}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Morphology Chain */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Morphology Chain</h4>
          <div className="flex flex-wrap items-center gap-1 text-sm font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
            {token.morphology.fullChain || token.surface}
          </div>
        </div>

        {/* Inflections */}
        {token.morphology.inflection && token.morphology.inflection.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inflection</h4>
            <div className="space-y-2">
              {token.morphology.inflection.map((inf, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-accent-600 bg-accent-50 px-1.5 rounded">{inf.affix}</span>
                  <div>
                    <span className="font-medium text-slate-700 mr-2">{inf.category}:</span>
                    <span className="text-slate-600">{inf.explanation}</span>
                    {inf.features && Object.keys(inf.features).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(inf.features).map(([k, v]) => (
                                <span key={k} className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded border border-slate-200">{k}: {v}</span>
                            ))}
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Derivations */}
        {token.morphology.derivation && token.morphology.derivation.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Derivation</h4>
            <div className="space-y-2">
              {token.morphology.derivation.map((der, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 rounded">{der.affix}</span>
                  <div>
                    <span className="font-medium text-slate-700 mr-2">{der.type}:</span>
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

const TokensTab = ({ result }: { result: AnalysisResult }) => (
  <div className="space-y-4">
    {result.tokens.map((token, idx) => (
      <TokenCard key={idx} token={token} />
    ))}
  </div>
);

const SuffixBreakdownTab = ({ result }: { result: AnalysisResult }) => (
  <div className="space-y-8">
    {result.tokens.map((token, idx) => (
      <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
          {token.surface}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {/* Root */}
          <div className="flex flex-col items-center">
             <div className="bg-slate-800 text-white px-3 py-2 rounded-lg font-mono font-bold shadow-sm">
               {token.morphology.root}
             </div>
             <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Root</span>
          </div>

          {/* Derivations */}
          {token.morphology.derivation?.map((d, i) => (
            <React.Fragment key={`d-${i}`}>
              <span className="text-slate-300 font-bold text-lg">+</span>
              <div className="flex flex-col items-center group relative cursor-help">
                <div className="bg-indigo-100 text-indigo-900 px-3 py-2 rounded-lg font-mono font-semibold border border-indigo-200">
                  {d.affix}
                </div>
                <span className="text-[10px] text-indigo-500 font-bold mt-1 uppercase max-w-[60px] truncate text-center">{d.type}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded w-48 z-10 text-center">
                  {d.explanation}
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* Inflections */}
          {token.morphology.inflection?.map((inf, i) => (
            <React.Fragment key={`i-${i}`}>
              <span className="text-slate-300 font-bold text-lg">+</span>
              <div className="flex flex-col items-center group relative cursor-help">
                <div className="bg-accent-50 text-accent-700 px-3 py-2 rounded-lg font-mono font-semibold border border-accent-100">
                  {inf.affix}
                </div>
                <span className="text-[10px] text-accent-500 font-bold mt-1 uppercase max-w-[60px] truncate text-center">{inf.category}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded w-48 z-10 text-center">
                  {inf.explanation}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Vowel Harmony */}
        {token.morphology.vowelHarmony && token.morphology.vowelHarmony.length > 0 && (
          <div className="mt-4 bg-slate-50 rounded-lg p-3 text-sm border border-slate-100">
            <h5 className="font-semibold text-slate-700 mb-2 text-xs uppercase tracking-wider">Harmony Rules Applied</h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {token.morphology.vowelHarmony.map((h, i) => (
                <li key={i} className="flex gap-2 items-start">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-turk-500 shrink-0"></div>
                   <div>
                     <span className="font-medium text-slate-800 block text-xs">{h.rule.replace(/-/g, ' ')}</span>
                     <span className="text-slate-500 text-xs">{h.explanation}</span>
                   </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
);

const ResultDisplay = ({ result }: { result: AnalysisResult }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'suffix'>('overview');

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    alert("JSON copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slideUp">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-thin">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tokens', label: 'Token Analysis' },
          { id: 'suffix', label: 'Suffix Breakdown' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50/10'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
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
          JSON
        </button>
      </div>

      <div className="p-6 bg-slate-50/50 min-h-[400px]">
        {activeTab === 'overview' && <OverviewTab result={result} />}
        {activeTab === 'tokens' && <TokensTab result={result} />}
        {activeTab === 'suffix' && <SuffixBreakdownTab result={result} />}
      </div>
    </div>
  );
};

// --- History Component ---

const HistoryPanel = ({ history, onSelect }: { history: HistoryItem[], onSelect: (item: HistoryItem) => void }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Analyses</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="text-left bg-white p-3 rounded-lg border border-slate-200 hover:border-turk-300 hover:shadow-md transition-all group"
          >
            <div className="font-medium text-slate-800 truncate group-hover:text-turk-700">{item.input}</div>
            <div className="text-xs text-slate-400 mt-1 flex justify-between">
              <span>{item.result.detected.isSentence ? 'Sentence' : 'Word'}</span>
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

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('turklingo_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (res: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      input: res.input,
      result: res
    };
    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('turklingo_history', JSON.stringify(newHistory));
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
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setInputText(item.input);
    setResult(item.result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8">
        
        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-slate-100">
          <label htmlFor="input" className="block text-sm font-semibold text-slate-700 mb-2">
            Enter Turkish word or sentence
          </label>
          
          <div className="relative">
            <textarea
              id="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., Evlerimizden..."
              className="w-full h-32 p-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-turk-400 focus:ring-0 transition-colors resize-none placeholder-slate-300"
            />
            {inputText && (
              <button 
                onClick={() => setInputText('')}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_INPUTS.slice(0, 3).map((ex) => (
                <Chip key={ex} label={ex} onClick={() => setInputText(ex)} />
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-slate-500 hover:text-slate-700 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {showOptions ? 'Hide Options' : 'Options'}
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !inputText.trim()}
                className="flex-grow md:flex-grow-0 bg-accent-600 hover:bg-accent-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-accent-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          <OptionsPanel options={options} setOptions={setOptions} isOpen={showOptions} />
        </section>

        {/* Results Section */}
        {error && <ErrorDisplay error={error} onRetry={handleAnalyze} />}
        
        {isLoading && <LoadingSkeleton />}
        
        {!isLoading && result && <ResultDisplay result={result} />}

        <HistoryPanel history={history} onSelect={restoreHistoryItem} />
      </main>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} TurkLingo Analyzer. Built with React, Tailwind & Gemini.</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

export default App;
