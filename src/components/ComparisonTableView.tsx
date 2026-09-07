import React, { useState } from "react";
import { Sliders, Plus, Award, Info, X } from "lucide-react";
import { DecisionAnalysis, ComparisonCriterion, ThemeMode } from "../types";

interface ComparisonTableViewProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
  theme: ThemeMode;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  analysis,
  onUpdateAnalysis,
  theme,
}) => {
  const [showAddCriterion, setShowAddCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState("");
  const [newCritDesc, setNewCritDesc] = useState("");
  const [newCritImportance, setNewCritImportance] = useState<"crucial" | "high" | "moderate">("high");
  const [newCritScores, setNewCritScores] = useState<Record<string, { score: number; note: string }>>({});

  const isPaper = theme === "paper";
  const criteria = analysis.comparisonMatrix.criteria;

  // Handle slider multiplier adjustment
  const handleWeightChange = (critId: string, userWeight: number) => {
    const updatedCriteria = criteria.map((c) =>
      c.id === critId ? { ...c, userWeight } : c
    );
    onUpdateAnalysis({
      ...analysis,
      comparisonMatrix: { criteria: updatedCriteria },
    });
  };

  // Add custom criterion
  const handleAddCriterionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCriterion: ComparisonCriterion = {
      id: `crit-${Date.now()}`,
      name: newCritName.trim(),
      description: newCritDesc.trim() || "Custom evaluation criterion",
      importance: newCritImportance,
      userWeight: 1,
      scores: analysis.options.map((opt) => ({
        optionId: opt.id,
        score: newCritScores[opt.id]?.score || 7,
        note: newCritScores[opt.id]?.note || "User rating",
      })),
    };

    onUpdateAnalysis({
      ...analysis,
      comparisonMatrix: { criteria: [...criteria, newCriterion] },
    });

    setNewCritName("");
    setNewCritDesc("");
    setNewCritScores({});
    setShowAddCriterion(false);
  };

  // Calculate total weighted scores per option
  const totalScores = analysis.options.map((opt) => {
    let total = 0;
    let maxPossible = 0;

    criteria.forEach((crit) => {
      const weight = crit.userWeight ?? (crit.importance === "crucial" ? 2 : crit.importance === "high" ? 1.5 : 1);
      const scoreObj = crit.scores.find((s) => s.optionId === opt.id);
      const scoreVal = scoreObj ? scoreObj.score : 5;
      total += scoreVal * weight;
      maxPossible += 10 * weight;
    });

    const percentage = Math.round((total / (maxPossible || 1)) * 100);
    return {
      optionId: opt.id,
      title: opt.title,
      totalWeighted: Math.round(total * 10) / 10,
      percentage,
    };
  });

  const highestScore = Math.max(...totalScores.map((s) => s.totalWeighted));

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "crucial":
        return (
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold border ${
              isPaper
                ? "bg-rose-100 text-rose-800 border-rose-300"
                : "bg-rose-950/70 text-rose-400 border-rose-800"
            }`}
          >
            Crucial (2.0x)
          </span>
        );
      case "high":
        return (
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold border ${
              isPaper
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-zinc-800 text-amber-400 border-zinc-700"
            }`}
          >
            High (1.5x)
          </span>
        );
      default:
        return (
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase text-zinc-500 border ${
              isPaper
                ? "bg-stone-100 text-stone-600 border-stone-300"
                : "bg-zinc-900 text-zinc-500 border-zinc-800"
            }`}
          >
            Moderate (1.0x)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Tally Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3
            className={`text-lg sm:text-xl font-serif font-bold ${
              isPaper ? "text-stone-900" : "text-white"
            }`}
          >
            Multi-Criteria Scorecard
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isPaper ? "text-stone-500" : "text-zinc-400"
            }`}
          >
            Side-by-side evaluation across core strategic dimensions. Adjust weight multipliers to match your priorities.
          </p>
        </div>

        <button
          onClick={() => setShowAddCriterion(true)}
          id="btn-add-criterion"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer self-start sm:self-auto active:translate-y-[0.5px] ${
            isPaper
              ? "bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Dimension</span>
        </button>
      </div>

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {totalScores.map((score) => {
          const isWinner = score.totalWeighted === highestScore;
          return (
            <div
              key={score.optionId}
              className={`border rounded-lg p-4 transition ${
                isWinner
                  ? isPaper
                    ? "bg-stone-50 border-stone-400 shadow-xs ring-1 ring-stone-400"
                    : "bg-[#1B1D22] border-zinc-600 ring-1 ring-zinc-500"
                  : isPaper
                  ? "bg-white border-stone-300 shadow-xs"
                  : "bg-[#141519] border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-semibold truncate ${
                    isPaper ? "text-stone-900" : "text-zinc-100"
                  }`}
                >
                  {score.title}
                </span>
                {isWinner && (
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold border ${
                      isPaper
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-zinc-800 text-amber-400 border-zinc-700"
                    }`}
                  >
                    <Award className="w-3 h-3" />
                    <span>Top Score</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between font-mono mb-2">
                <span
                  className={`text-2xl font-bold ${
                    isWinner
                      ? isPaper
                        ? "text-stone-950"
                        : "text-amber-400"
                      : isPaper
                      ? "text-stone-700"
                      : "text-zinc-300"
                  }`}
                >
                  {score.totalWeighted}
                </span>
                <span className="text-xs text-zinc-500">
                  {score.percentage}% of max
                </span>
              </div>

              {/* Clean solid progress track */}
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isPaper ? "bg-stone-200" : "bg-zinc-800"
                }`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isWinner
                      ? isPaper
                        ? "bg-stone-900"
                        : "bg-amber-400"
                      : isPaper
                      ? "bg-stone-400"
                      : "bg-zinc-600"
                  }`}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Scorecard Table */}
      <div
        className={`border rounded-lg overflow-hidden transition ${
          isPaper
            ? "bg-white border-stone-300 shadow-xs"
            : "bg-[#141519] border-zinc-800"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className={`border-b font-mono uppercase tracking-wider text-[11px] ${
                  isPaper
                    ? "bg-stone-100/70 border-stone-300 text-stone-700"
                    : "bg-[#0E0F12] border-zinc-800 text-zinc-400"
                }`}
              >
                <th className="py-3 px-4 w-72">Evaluation Dimension</th>
                <th className="py-3 px-4 w-44">Multiplier Weight</th>
                {analysis.options.map((opt) => (
                  <th key={opt.id} className="py-3 px-4 min-w-[200px]">
                    {opt.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isPaper ? "divide-stone-200" : "divide-zinc-800/80"
              }`}
            >
              {criteria.map((crit) => {
                const currentMultiplier =
                  crit.userWeight ??
                  (crit.importance === "crucial"
                    ? 2
                    : crit.importance === "high"
                    ? 1.5
                    : 1);

                return (
                  <tr
                    key={crit.id}
                    className={`transition-colors ${
                      isPaper ? "hover:bg-stone-50/70" : "hover:bg-zinc-850/40"
                    }`}
                  >
                    {/* Dimension Name & Description */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-semibold ${
                            isPaper ? "text-stone-900" : "text-white"
                          }`}
                        >
                          {crit.name}
                        </span>
                        {getImportanceBadge(crit.importance)}
                      </div>
                      <p
                        className={`text-[11px] leading-relaxed ${
                          isPaper ? "text-stone-500" : "text-zinc-500"
                        }`}
                      >
                        {crit.description}
                      </p>
                    </td>

                    {/* Weight Multiplier Controller */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-xs">
                          {currentMultiplier}x
                        </span>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.5"
                          value={currentMultiplier}
                          onChange={(e) =>
                            handleWeightChange(crit.id, parseFloat(e.target.value))
                          }
                          className="w-24 accent-stone-800 dark:accent-amber-400 cursor-pointer"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Multiplier priority
                      </span>
                    </td>

                    {/* Scores for Each Option */}
                    {analysis.options.map((opt) => {
                      const scoreData = crit.scores.find((s) => s.optionId === opt.id);
                      const val = scoreData?.score || 5;
                      const note = scoreData?.note || "Neutral evaluation";

                      return (
                        <td key={opt.id} className="py-3.5 px-4 align-top">
                          <div className="flex items-baseline gap-1.5 font-mono mb-1">
                            <span
                              className={`text-sm font-bold ${
                                val >= 8
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : val <= 4
                                  ? "text-rose-600 dark:text-rose-400"
                                  : isPaper
                                  ? "text-stone-800"
                                  : "text-zinc-300"
                              }`}
                            >
                              {val}
                            </span>
                            <span className="text-[10px] text-zinc-500">/ 10</span>
                          </div>
                          <p
                            className={`text-[11px] leading-relaxed ${
                              isPaper ? "text-stone-600" : "text-zinc-400"
                            }`}
                          >
                            {note}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Criterion Modal */}
      {showAddCriterion && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            className={`border rounded-xl max-w-md w-full p-5 shadow-lg ${
              isPaper
                ? "bg-white border-stone-300 text-stone-900"
                : "bg-[#15161A] border-zinc-700 text-zinc-100"
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <h4 className="text-sm font-serif font-bold">Add Evaluation Dimension</h4>
              <button
                onClick={() => setShowAddCriterion(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCriterionSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                  Dimension Title
                </label>
                <input
                  type="text"
                  required
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  placeholder="e.g., Intellectual Autonomy"
                  className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                    isPaper
                      ? "bg-stone-50 border-stone-300 focus:border-stone-700"
                      : "bg-[#0E0F12] border-zinc-700 focus:border-amber-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                  Description / Metric
                </label>
                <input
                  type="text"
                  value={newCritDesc}
                  onChange={(e) => setNewCritDesc(e.target.value)}
                  placeholder="e.g., Freedom to set own schedule and technical direction"
                  className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                    isPaper
                      ? "bg-stone-50 border-stone-300 focus:border-stone-700"
                      : "bg-[#0E0F12] border-zinc-700 focus:border-amber-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                  Priority Weight
                </label>
                <select
                  value={newCritImportance}
                  onChange={(e) =>
                    setNewCritImportance(
                      e.target.value as "crucial" | "high" | "moderate"
                    )
                  }
                  className={`w-full px-2.5 py-1.5 rounded-md border text-xs outline-none ${
                    isPaper
                      ? "bg-stone-50 border-stone-300"
                      : "bg-[#0E0F12] border-zinc-700"
                  }`}
                >
                  <option value="crucial">Crucial Priority (2.0x Multiplier)</option>
                  <option value="high">High Priority (1.5x Multiplier)</option>
                  <option value="moderate">Standard Priority (1.0x Multiplier)</option>
                </select>
              </div>

              {/* Option score inputs */}
              <div className="pt-2 border-t border-inherit space-y-2">
                <span className="block text-[11px] font-mono text-zinc-500 uppercase">
                  Initial Ratings (1-10):
                </span>
                {analysis.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2 text-xs">
                    <span className="w-32 truncate font-semibold">{opt.title}:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      defaultValue={7}
                      onChange={(e) =>
                        setNewCritScores((prev) => ({
                          ...prev,
                          [opt.id]: {
                            score: Number(e.target.value),
                            note: prev[opt.id]?.note || "User rating",
                          },
                        }))
                      }
                      className={`w-16 px-2 py-1 rounded border text-xs text-center font-mono ${
                        isPaper
                          ? "bg-stone-50 border-stone-300"
                          : "bg-[#0E0F12] border-zinc-700"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Brief note..."
                      onChange={(e) =>
                        setNewCritScores((prev) => ({
                          ...prev,
                          [opt.id]: {
                            score: prev[opt.id]?.score || 7,
                            note: e.target.value,
                          },
                        }))
                      }
                      className={`flex-1 px-2 py-1 rounded border text-xs ${
                        isPaper
                          ? "bg-stone-50 border-stone-300"
                          : "bg-[#0E0F12] border-zinc-700"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCriterion(false)}
                  className="px-3 py-1.5 rounded-md text-xs border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                    isPaper
                      ? "bg-stone-900 text-white hover:bg-stone-800"
                      : "bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold"
                  }`}
                >
                  Save Dimension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
