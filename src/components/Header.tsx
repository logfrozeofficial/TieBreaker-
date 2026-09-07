import React from "react";
import { Scale, History, PlusCircle, Share2, Check, Sun, Moon, FileText } from "lucide-react";
import { ThemeMode } from "../types";

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  hasActiveDecision: boolean;
  onExport: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  historyCount,
  hasActiveDecision,
  onExport,
  theme,
  onToggleTheme,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    onExport();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaper = theme === "paper";

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-colors ${
        isPaper
          ? "bg-[#FAF9F5] border-stone-300/80 text-stone-900"
          : "bg-[#111215] border-zinc-800 text-zinc-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity - authentic editorial masthead */}
        <div
          className="flex items-center gap-3.5 cursor-pointer select-none group"
          onClick={onNewDecision}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center font-bold transition ${
              isPaper
                ? "bg-stone-900 text-stone-100 shadow-xs group-hover:bg-stone-800"
                : "bg-zinc-800 text-amber-400 border border-zinc-700 shadow-xs group-hover:bg-zinc-750"
            }`}
          >
            <Scale className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-base sm:text-lg font-bold tracking-tight font-serif ${
                  isPaper ? "text-stone-900" : "text-white"
                }`}
              >
                The Tiebreaker
              </h1>
              <span
                className={`text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded border font-semibold ${
                  isPaper
                    ? "bg-stone-200/70 text-stone-700 border-stone-300"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                Dossier Engine
              </span>
            </div>
            <p
              className={`text-[11px] hidden sm:block ${
                isPaper ? "text-stone-500" : "text-zinc-400"
              }`}
            >
              Structured trade-off evaluation & decisive resolution
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-2">
          {hasActiveDecision && (
            <>
              <button
                id="btn-new-decision"
                onClick={onNewDecision}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer active:translate-y-[1px] ${
                  isPaper
                    ? "bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 opacity-80" />
                <span className="hidden sm:inline">New Dilemma</span>
                <span className="sm:hidden">New</span>
              </button>

              <button
                id="btn-share-summary"
                onClick={handleShare}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer active:translate-y-[1px] ${
                  isPaper
                    ? "bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                }`}
                title="Copy Decision Briefing to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Copied Memo
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 opacity-70" />
                    <span className="hidden sm:inline">Export Memo</span>
                  </>
                )}
              </button>
            </>
          )}

          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer active:translate-y-[1px] ${
              isPaper
                ? "bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
            }`}
          >
            <History className="w-3.5 h-3.5 opacity-70" />
            <span className="hidden sm:inline">Archive</span>
            {historyCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${
                  isPaper
                    ? "bg-stone-100 text-stone-700 border-stone-300"
                    : "bg-zinc-900 text-zinc-300 border-zinc-700"
                }`}
              >
                {historyCount}
              </span>
            )}
          </button>

          {/* Theme Switcher: Paper (Editorial) vs Slate (Executive Dark) */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className={`p-1.5 rounded-md border transition cursor-pointer active:translate-y-[1px] ${
              isPaper
                ? "bg-stone-200/80 hover:bg-stone-200 text-stone-700 border-stone-300 shadow-xs"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
            }`}
            title={isPaper ? "Switch to Matte Slate Mode" : "Switch to Editorial Paper Mode"}
          >
            {isPaper ? (
              <Moon className="w-4 h-4 stroke-[2]" />
            ) : (
              <Sun className="w-4 h-4 stroke-[2] text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
