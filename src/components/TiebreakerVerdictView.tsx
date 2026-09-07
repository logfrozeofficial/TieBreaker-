import React, { useState } from "react";
import { Award, Compass, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2, RotateCcw, HelpCircle } from "lucide-react";
import { DecisionAnalysis, ThemeMode } from "../types";

interface TiebreakerVerdictViewProps {
  analysis: DecisionAnalysis;
  theme: ThemeMode;
}

export const TiebreakerVerdictView: React.FC<TiebreakerVerdictViewProps> = ({
  analysis,
  theme,
}) => {
  const verdict = analysis.tiebreakerVerdict;
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [coinThought, setCoinThought] = useState<string | null>(null);

  const isPaper = theme === "paper";

  const handleFlipCoin = () => {
    setCoinFlipping(true);
    setCoinResult(null);
    setCoinThought("Notice your gut right now: what do you subconsciously pray for while it is in the air?");

    setTimeout(() => {
      const randomOption =
        analysis.options[Math.floor(Math.random() * analysis.options.length)];
      setCoinResult(randomOption.title);
      setCoinFlipping(false);
      setCoinThought(
        "Pause right now: Are you relieved or disappointed by this outcome? Your immediate emotional reflex reveals what you truly prioritize."
      );
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {/* Prime Verdict Executive Dossier Card */}
      <div
        className={`border rounded-xl p-6 sm:p-8 transition-colors ${
          isPaper
            ? "bg-white border-stone-300/90 text-stone-900 shadow-xs"
            : "bg-[#15161A] border-zinc-800 text-zinc-100"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-inherit">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold border ${
                isPaper
                  ? "bg-stone-100 text-stone-700 border-stone-300"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700"
              }`}
            >
              Determination Memo
            </span>
            <span
              className={`text-xs font-mono ${
                isPaper ? "text-stone-500" : "text-zinc-500"
              }`}
            >
              Ref #TB-{analysis.id.slice(-6)}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono border ${
              isPaper
                ? "bg-stone-50 border-stone-300 text-stone-700"
                : "bg-zinc-900 border-zinc-800 text-zinc-300"
            }`}
          >
            <span className="text-zinc-500">Certainty Index:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {verdict.confidencePercentage}%
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div
            className={`text-xs uppercase font-mono tracking-wider font-semibold mb-1.5 ${
              isPaper ? "text-stone-500" : "text-zinc-400"
            }`}
          >
            Recommended Course of Action:
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-3 ${
              isPaper ? "text-stone-950" : "text-white"
            }`}
          >
            {verdict.recommendedOptionTitle}
          </h2>
          <p
            className={`text-sm sm:text-base leading-relaxed max-w-3xl ${
              isPaper ? "text-stone-700" : "text-zinc-300"
            }`}
          >
            {verdict.primaryReason}
          </p>
        </div>

        {/* The Core Trade-Off / Dilemma */}
        <div
          className={`p-4 rounded-lg border ${
            isPaper
              ? "bg-stone-50 border-stone-200 text-stone-800"
              : "bg-[#0E0F12] border-zinc-800 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-bold mb-1 text-amber-700 dark:text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>The Fundamental Trade-Off</span>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-inherit">
            "{verdict.coreDilemma}"
          </p>
        </div>
      </div>

      {/* If-Then Heuristic Rules */}
      <div className="space-y-3">
        <div>
          <h3
            className={`text-base sm:text-lg font-serif font-bold ${
              isPaper ? "text-stone-900" : "text-white"
            }`}
          >
            Conditional Decision Rules
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isPaper ? "text-stone-500" : "text-zinc-400"
            }`}
          >
            If specific personal boundary conditions shift, recalibrate according to these logical rules:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {verdict.ifThenRules.map((rule, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-4 transition ${
                isPaper
                  ? "bg-white border-stone-300 text-stone-800 shadow-xs"
                  : "bg-[#15161A] border-zinc-800 text-zinc-200"
              }`}
            >
              <div
                className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-1.5 ${
                  isPaper ? "text-stone-500" : "text-zinc-500"
                }`}
              >
                Heuristic #{idx + 1}
              </div>
              <div
                className={`text-xs sm:text-sm font-semibold mb-2 ${
                  isPaper ? "text-stone-950" : "text-white"
                }`}
              >
                If {rule.condition}...
              </div>
              <div
                className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold mb-2 border ${
                  isPaper
                    ? "bg-stone-100 text-stone-900 border-stone-300"
                    : "bg-zinc-800 text-amber-400 border-zinc-700"
                }`}
              >
                → Select {rule.recommendation}
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isPaper ? "text-stone-600" : "text-zinc-400"
                }`}
              >
                {rule.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Regret Minimization Framework & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Regret Minimization */}
        <div
          className={`border rounded-lg p-5 flex flex-col justify-between ${
            isPaper
              ? "bg-white border-stone-300 text-stone-800 shadow-xs"
              : "bg-[#15161A] border-zinc-800 text-zinc-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold mb-2.5 text-rose-700 dark:text-rose-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Regret Minimization Horizon</span>
            </div>
            <h4
              className={`text-sm sm:text-base font-serif font-bold mb-2 ${
                isPaper ? "text-stone-950" : "text-white"
              }`}
            >
              The 10-Year Prospective Test
            </h4>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isPaper ? "text-stone-600" : "text-zinc-300"
              }`}
            >
              {verdict.regretMinimizationVerdict}
            </p>
          </div>
          <div
            className={`mt-4 pt-3 border-t text-[11px] italic ${
              isPaper
                ? "border-stone-200 text-stone-500"
                : "border-zinc-800 text-zinc-500"
            }`}
          >
            "People chronically overestimate the risk of taking an ambitious path, and underestimate the permanent regret of inertia."
          </div>
        </div>

        {/* Immediate 3-Step Momentum Plan */}
        <div
          className={`border rounded-lg p-5 ${
            isPaper
              ? "bg-white border-stone-300 text-stone-800 shadow-xs"
              : "bg-[#15161A] border-zinc-800 text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold mb-2.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Immediate Execution Sequence</span>
          </div>
          <h4
            className={`text-sm sm:text-base font-serif font-bold mb-3 ${
              isPaper ? "text-stone-950" : "text-white"
            }`}
          >
            3 practical moves to lock in direction:
          </h4>
          <div className="space-y-2.5">
            {verdict.immediateNextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold shrink-0 text-xs border ${
                    isPaper
                      ? "bg-stone-100 border-stone-300 text-stone-800"
                      : "bg-zinc-800 border-zinc-700 text-zinc-200"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`leading-relaxed pt-0.5 ${
                    isPaper ? "text-stone-700" : "text-zinc-300"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Psychology Tool: The Gut-Check Coin Flip */}
      <div
        className={`border rounded-lg p-5 sm:p-6 text-center max-w-xl mx-auto ${
          isPaper
            ? "bg-stone-50 border-stone-300 text-stone-800"
            : "bg-[#111215] border-zinc-800 text-zinc-200"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-md border flex items-center justify-center mx-auto mb-3 ${
            isPaper
              ? "bg-white border-stone-300 text-stone-700"
              : "bg-zinc-800 border-zinc-700 text-amber-400"
          }`}
        >
          <HeartHandshake className="w-5 h-5" />
        </div>
        <h4
          className={`text-base font-serif font-bold mb-1 ${
            isPaper ? "text-stone-900" : "text-white"
          }`}
        >
          The Subconscious Gut Check
        </h4>
        <p
          className={`text-xs max-w-md mx-auto mb-4 leading-relaxed ${
            isPaper ? "text-stone-600" : "text-zinc-400"
          }`}
        >
          Still hesitating? Perform the psychological coin toss. Don't worry about where it lands—pay attention to what outcome you quietly hope for while it is in the air.
        </p>

        <button
          onClick={handleFlipCoin}
          disabled={coinFlipping}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-xs border transition cursor-pointer active:translate-y-[1px] disabled:opacity-50 ${
            isPaper
              ? "bg-stone-900 hover:bg-stone-800 text-white border-stone-900 shadow-xs"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700"
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${coinFlipping ? "animate-spin" : ""}`} />
          <span>{coinFlipping ? "Tossing In The Air..." : "Toss The Coin"}</span>
        </button>

        {coinThought && (
          <div
            className={`mt-4 p-3.5 rounded-lg border text-left ${
              isPaper
                ? "bg-white border-stone-300 text-stone-800"
                : "bg-[#15161A] border-zinc-800 text-zinc-200"
            }`}
          >
            {coinResult && (
              <div className="text-center mb-1.5">
                <span
                  className={`text-[10px] uppercase font-mono tracking-wider ${
                    isPaper ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  The Coin Landed On:
                </span>
                <div
                  className={`text-base font-serif font-bold mt-0.5 ${
                    isPaper ? "text-stone-900" : "text-amber-400"
                  }`}
                >
                  {coinResult}
                </div>
              </div>
            )}
            <p
              className={`text-xs text-center leading-relaxed ${
                isPaper ? "text-stone-600" : "text-zinc-400"
              }`}
            >
              {coinThought}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
