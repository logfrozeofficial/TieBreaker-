import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DecisionInputForm } from "./components/DecisionInputForm";
import { ProsConsView } from "./components/ProsConsView";
import { ComparisonTableView } from "./components/ComparisonTableView";
import { SwotView } from "./components/SwotView";
import { TiebreakerVerdictView } from "./components/TiebreakerVerdictView";
import { FollowUpChat } from "./components/FollowUpChat";
import { HistoryModal } from "./components/HistoryModal";
import { DecisionAnalysis, ActiveTab, ThemeMode } from "./types";
import { formatDecisionToMarkdown } from "./utils/exportBrief";
import {
  Award,
  Scale,
  Table,
  Grid,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

const STORAGE_KEY = "the_tiebreaker_saved_decisions";
const THEME_KEY = "the_tiebreaker_theme";

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === "slate" || savedTheme === "paper") return savedTheme;
    } catch (e) {
      // fallback
    }
    return "paper"; // Default to grounded, human, editorial paper aesthetic
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("tiebreaker");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme changes
  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  // Sync dark class on html element for tailwind dark: variants
  useEffect(() => {
    if (theme === "slate") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Load saved history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedDecisions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
  }, []);

  // Sync saved history to localStorage
  const saveToStorage = (updated: DecisionAnalysis[]) => {
    setSavedDecisions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  };

  // Loading status messages
  useEffect(() => {
    if (!isLoading) return;
    const steps = [
      "Cataloging options & establishing evaluation baseline...",
      "Computing weighted advantage ledger (pros) & exposure risks (cons)...",
      "Drafting 2×2 SWOT matrix (Internal vs. External dynamics)...",
      "Populating multi-criteria comparison scorecard...",
      "Applying regret-minimization heuristics to resolve the tie...",
    ];
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % steps.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleAnalyzeDecision = async (
    question: string,
    options: string[],
    context: string
  ) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options, context }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to analyze decision. Please try again.");
      }

      const data = await response.json();

      const newAnalysis: DecisionAnalysis = {
        id: `decision-${Date.now()}`,
        createdAt: new Date().toISOString(),
        question,
        context,
        summary: data.summary,
        options: data.options,
        comparisonMatrix: data.comparisonMatrix,
        tiebreakerVerdict: data.tiebreakerVerdict,
      };

      setCurrentAnalysis(newAnalysis);
      setActiveTab("tiebreaker");

      const updatedVault = [newAnalysis, ...savedDecisions.filter((d) => d.question !== question)];
      saveToStorage(updatedVault);
      showToast("Deliberation complete & filed to vault.");
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMsg(err.message || "An unexpected error occurred while analyzing the decision.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportBrief = () => {
    if (!currentAnalysis) return;
    const md = formatDecisionToMarkdown(currentAnalysis);
    navigator.clipboard.writeText(md);
    showToast("Decision Memorandum copied as Markdown.");
  };

  const handleDeleteDecision = (id: string) => {
    const updated = savedDecisions.filter((d) => d.id !== id);
    saveToStorage(updated);
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
  };

  const handleClearAllHistory = () => {
    saveToStorage([]);
    showToast("Decision archive cleared.");
  };

  const isPaper = theme === "paper";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isPaper
          ? "bg-[#F7F5F0] text-stone-900"
          : "bg-[#0C0D10] text-zinc-100"
      }`}
    >
      {/* Editorial Masthead Header */}
      <Header
        onNewDecision={() => setCurrentAnalysis(null)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedDecisions.length}
        hasActiveDecision={Boolean(currentAnalysis)}
        onExport={handleExportBrief}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold shadow-lg transition ${
            isPaper
              ? "bg-stone-900 text-white border-stone-800"
              : "bg-zinc-800 text-amber-300 border-zinc-700"
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        {/* Error Notification */}
        {errorMsg && (
          <div
            className={`mb-6 p-4 rounded-lg border text-xs sm:text-sm flex items-start gap-3 ${
              isPaper
                ? "bg-rose-50 border-rose-300 text-rose-900"
                : "bg-rose-950/40 border-rose-800 text-rose-200"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">Deliberation Interrupted</div>
              <div>{errorMsg}</div>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-950 dark:text-rose-400 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State - Grounded Mechanical Deliberation */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div
              className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-5 ${
                isPaper
                  ? "bg-white border-stone-300 text-stone-900 shadow-xs"
                  : "bg-zinc-900 border-zinc-800 text-amber-400"
              }`}
            >
              <div
                className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
                  isPaper ? "border-stone-800" : "border-amber-400"
                }`}
              />
            </div>
            <h3
              className={`text-lg sm:text-xl font-serif font-bold mb-2 ${
                isPaper ? "text-stone-900" : "text-white"
              }`}
            >
              Synthesizing Decision Architecture
            </h3>
            <p
              className={`text-xs font-mono leading-relaxed ${
                isPaper ? "text-stone-600" : "text-zinc-400"
              }`}
            >
              {[
                "Cataloging options & establishing evaluation baseline...",
                "Computing weighted advantage ledger (pros) & exposure risks (cons)...",
                "Drafting 2×2 SWOT matrix (Internal vs. External dynamics)...",
                "Populating multi-criteria comparison scorecard...",
                "Applying regret-minimization heuristics to resolve the tie...",
              ][loadingStep]}
            </p>
          </div>
        )}

        {/* Input Worksheet */}
        {!currentAnalysis && !isLoading && (
          <DecisionInputForm
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
            theme={theme}
          />
        )}

        {/* Active Deliberation View */}
        {currentAnalysis && !isLoading && (
          <div className="space-y-6">
            {/* Top Masthead & Dilemma Dossier */}
            <div
              className={`border rounded-xl p-5 sm:p-7 transition ${
                isPaper
                  ? "bg-white border-stone-300/90 text-stone-900 shadow-xs"
                  : "bg-[#15161A] border-zinc-800 text-zinc-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <button
                  onClick={() => setCurrentAnalysis(null)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium transition cursor-pointer active:translate-y-[0.5px] ${
                    isPaper
                      ? "text-stone-600 hover:text-stone-950"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Enter another dilemma</span>
                </button>

                <div
                  className={`flex items-center gap-2 text-[11px] font-mono ${
                    isPaper ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  <span>Recorded: {new Date(currentAnalysis.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}</span>
                  <span>•</span>
                  <span>{currentAnalysis.options.length} Paths Under Review</span>
                </div>
              </div>

              <h2
                className={`text-xl sm:text-2xl font-serif font-bold tracking-tight mb-2 ${
                  isPaper ? "text-stone-950" : "text-white"
                }`}
              >
                {currentAnalysis.question}
              </h2>

              <p
                className={`text-xs sm:text-sm leading-relaxed mb-4 max-w-3xl ${
                  isPaper ? "text-stone-600" : "text-zinc-300"
                }`}
              >
                {currentAnalysis.summary}
              </p>

              {/* Evaluated Options Summary Tags */}
              <div
                className={`flex flex-wrap items-center gap-2 pt-3 border-t ${
                  isPaper ? "border-stone-200" : "border-zinc-800"
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-mono tracking-wider font-semibold ${
                    isPaper ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  Evaluated Paths:
                </span>
                {currentAnalysis.options.map((opt) => {
                  const isWinner =
                    opt.id === currentAnalysis.tiebreakerVerdict.recommendedOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition ${
                        isWinner
                          ? isPaper
                            ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                            : "bg-zinc-800 text-amber-300 border-zinc-700"
                          : isPaper
                          ? "bg-stone-50 text-stone-700 border-stone-300"
                          : "bg-[#0E0F12] text-zinc-400 border-zinc-800"
                      }`}
                    >
                      {isWinner && <Award className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{opt.title}</span>
                      {isWinner && (
                        <span className="text-[10px] font-mono uppercase opacity-75">
                          [Verdict]
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* View Switcher Tabs - Solid, Functional Tabs */}
            <div
              className={`flex items-center justify-start border-b gap-1 overflow-x-auto pb-0 ${
                isPaper ? "border-stone-300" : "border-zinc-800"
              }`}
            >
              <button
                id="tab-btn-tiebreaker"
                onClick={() => setActiveTab("tiebreaker")}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === "tiebreaker"
                    ? isPaper
                      ? "border-stone-900 text-stone-900 font-bold"
                      : "border-amber-400 text-amber-400 font-bold"
                    : isPaper
                    ? "border-transparent text-stone-600 hover:text-stone-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>The Tiebreaker Verdict</span>
              </button>

              <button
                id="tab-btn-pros-cons"
                onClick={() => setActiveTab("pros-cons")}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === "pros-cons"
                    ? isPaper
                      ? "border-stone-900 text-stone-900 font-bold"
                      : "border-amber-400 text-amber-400 font-bold"
                    : isPaper
                    ? "border-transparent text-stone-600 hover:text-stone-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Pros & Cons Ledger</span>
              </button>

              <button
                id="tab-btn-comparison"
                onClick={() => setActiveTab("comparison")}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === "comparison"
                    ? isPaper
                      ? "border-stone-900 text-stone-900 font-bold"
                      : "border-amber-400 text-amber-400 font-bold"
                    : isPaper
                    ? "border-transparent text-stone-600 hover:text-stone-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Comparison Scorecard</span>
              </button>

              <button
                id="tab-btn-swot"
                onClick={() => setActiveTab("swot")}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
                  activeTab === "swot"
                    ? isPaper
                      ? "border-stone-900 text-stone-900 font-bold"
                      : "border-amber-400 text-amber-400 font-bold"
                    : isPaper
                    ? "border-transparent text-stone-600 hover:text-stone-950"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>2×2 SWOT Matrix</span>
              </button>
            </div>

            {/* Active Tab View */}
            <div>
              {activeTab === "tiebreaker" && (
                <TiebreakerVerdictView
                  analysis={currentAnalysis}
                  theme={theme}
                />
              )}

              {activeTab === "pros-cons" && (
                <ProsConsView
                  analysis={currentAnalysis}
                  onUpdateAnalysis={setCurrentAnalysis}
                  theme={theme}
                />
              )}

              {activeTab === "comparison" && (
                <ComparisonTableView
                  analysis={currentAnalysis}
                  onUpdateAnalysis={setCurrentAnalysis}
                  theme={theme}
                />
              )}

              {activeTab === "swot" && (
                <SwotView
                  analysis={currentAnalysis}
                  theme={theme}
                />
              )}
            </div>

            {/* Stress-Test Deliberation Counsel */}
            <div
              className={`pt-6 border-t ${
                isPaper ? "border-stone-300" : "border-zinc-800"
              }`}
            >
              <FollowUpChat
                analysis={currentAnalysis}
                theme={theme}
              />
            </div>
          </div>
        )}
      </main>

      {/* History Archive Vault Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(d) => {
          setCurrentAnalysis(d);
          setActiveTab("tiebreaker");
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearAll={handleClearAllHistory}
        theme={theme}
      />
    </div>
  );
}
