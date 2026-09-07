import React, { useState } from "react";
import { Zap, AlertTriangle, TrendingUp, ShieldAlert, ShieldCheck } from "lucide-react";
import { DecisionAnalysis, ThemeMode } from "../types";

interface SwotViewProps {
  analysis: DecisionAnalysis;
  theme: ThemeMode;
}

export const SwotView: React.FC<SwotViewProps> = ({ analysis, theme }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(
    analysis.options[0]?.id || ""
  );

  const isPaper = theme === "paper";

  const currentOption =
    analysis.options.find((o) => o.id === selectedOptionId) || analysis.options[0];

  if (!currentOption) return null;

  const swot = currentOption.swot;

  return (
    <div className="space-y-6">
      {/* Option Selector Segmented Control */}
      <div
        className={`flex items-center justify-between pb-3 border-b ${
          isPaper ? "border-stone-300" : "border-zinc-800"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {analysis.options.map((opt) => {
            const isSelected = opt.id === selectedOptionId;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition cursor-pointer active:translate-y-[0.5px] border ${
                  isSelected
                    ? isPaper
                      ? "bg-stone-900 text-white border-stone-900 font-semibold shadow-xs"
                      : "bg-zinc-800 text-white border-zinc-600 font-semibold"
                    : isPaper
                    ? "bg-white hover:bg-stone-100 text-stone-700 border-stone-300 shadow-xs"
                    : "bg-[#15161A] hover:bg-[#1C1E24] text-zinc-400 border-zinc-800"
                }`}
              >
                <span>{opt.title}</span>
                {opt.id === analysis.tiebreakerVerdict.recommendedOptionId && (
                  <span
                    className={`ml-2 text-[10px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border ${
                      isSelected
                        ? isPaper
                          ? "bg-stone-800 text-white border-stone-700"
                          : "bg-zinc-900 text-amber-400 border-zinc-700"
                        : isPaper
                        ? "bg-stone-100 text-stone-700 border-stone-300"
                        : "bg-zinc-900 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    Recommended
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span
          className={`text-[11px] font-mono uppercase tracking-wider hidden sm:inline ${
            isPaper ? "text-stone-500" : "text-zinc-500"
          }`}
        >
          Classic 2×2 Strategic Matrix
        </span>
      </div>

      {/* Real 2x2 Matrix with Intersecting Crosshairs */}
      <div
        className={`border rounded-xl overflow-hidden transition ${
          isPaper
            ? "bg-white border-stone-300 shadow-xs"
            : "bg-[#141519] border-zinc-800"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Top-Left: Strengths (Internal • Helpful) */}
          <div
            className={`p-5 border-b md:border-r ${
              isPaper
                ? "border-stone-200 bg-white"
                : "border-zinc-800/90 bg-[#15161A]"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                    isPaper
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-emerald-950/70 text-emerald-400 border-emerald-800"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isPaper ? "text-stone-900" : "text-white"
                    }`}
                  >
                    Strengths (S)
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Internal • Favorable
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                {swot.strengths.length} Factors
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {swot.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    +
                  </span>
                  <span className={isPaper ? "text-stone-700" : "text-zinc-300"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top-Right: Weaknesses (Internal • Harmful) */}
          <div
            className={`p-5 border-b ${
              isPaper
                ? "border-stone-200 bg-[#FCFAF7]"
                : "border-zinc-800/90 bg-[#121316]"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                    isPaper
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : "bg-amber-950/70 text-amber-400 border-amber-800"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isPaper ? "text-stone-900" : "text-white"
                    }`}
                  >
                    Weaknesses (W)
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Internal • Vulnerable
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                {swot.weaknesses.length} Factors
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {swot.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold shrink-0">
                    -
                  </span>
                  <span className={isPaper ? "text-stone-700" : "text-zinc-300"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom-Left: Opportunities (External • Helpful) */}
          <div
            className={`p-5 border-b md:border-b-0 md:border-r ${
              isPaper
                ? "border-stone-200 bg-[#FCFAF7]"
                : "border-zinc-800/90 bg-[#121316]"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                    isPaper
                      ? "bg-blue-50 text-blue-800 border-blue-300"
                      : "bg-blue-950/70 text-blue-400 border-blue-800"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isPaper ? "text-stone-900" : "text-white"
                    }`}
                  >
                    Opportunities (O)
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    External • Upside Potential
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                {swot.opportunities.length} Factors
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {swot.opportunities.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    ↗
                  </span>
                  <span className={isPaper ? "text-stone-700" : "text-zinc-300"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom-Right: Threats (External • Harmful) */}
          <div
            className={`p-5 ${
              isPaper ? "bg-white" : "bg-[#15161A]"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                    isPaper
                      ? "bg-rose-50 text-rose-800 border-rose-300"
                      : "bg-rose-950/70 text-rose-400 border-rose-800"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4
                    className={`text-xs font-mono font-bold uppercase tracking-wider ${
                      isPaper ? "text-stone-900" : "text-white"
                    }`}
                  >
                    Threats (T)
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    External • Downside Hazards
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500">
                {swot.threats.length} Factors
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {swot.threats.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-mono text-rose-600 dark:text-rose-400 font-bold shrink-0">
                    ↘
                  </span>
                  <span className={isPaper ? "text-stone-700" : "text-zinc-300"}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Strategic Synthesis & Mitigation Plan */}
      <div
        className={`border rounded-lg p-5 transition ${
          isPaper
            ? "bg-stone-50 border-stone-300 text-stone-900"
            : "bg-[#111215] border-zinc-800 text-zinc-100"
        }`}
      >
        <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Strategic Synthesis & Hedging Guidance</span>
        </div>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            isPaper ? "text-stone-700" : "text-zinc-300"
          }`}
        >
          {swot.mitigationAdvice}
        </p>
      </div>
    </div>
  );
};
