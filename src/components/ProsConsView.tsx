import React, { useState } from "react";
import { Plus, Check, X, ArrowUpRight, ArrowDownRight, Scale, Sliders, Trash2 } from "lucide-react";
import { DecisionAnalysis, OptionAnalysis, ProConItem, ImpactLevel, ThemeMode } from "../types";

interface ProsConsViewProps {
  analysis: DecisionAnalysis;
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
  theme: ThemeMode;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  analysis,
  onUpdateAnalysis,
  theme,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    analysis.options[0]?.id || ""
  );
  const [newPointType, setNewPointType] = useState<"pro" | "con">("pro");
  const [newPointText, setNewPointText] = useState("");
  const [newPointDetail, setNewPointDetail] = useState("");
  const [newPointImpact, setNewPointImpact] = useState<ImpactLevel>("medium");
  const [newPointWeight, setNewPointWeight] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);

  const isPaper = theme === "paper";

  // Toggle item excluded state
  const handleToggleItem = (optionId: string, itemId: string, type: "pros" | "cons") => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        [type]: opt[type].map((item) =>
          item.id === itemId ? { ...item, userExcluded: !item.userExcluded } : item
        ),
      };
    });
    onUpdateAnalysis({ ...analysis, options: updatedOptions });
  };

  // Adjust weight
  const handleAdjustWeight = (
    optionId: string,
    itemId: string,
    type: "pros" | "cons",
    delta: number
  ) => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        [type]: opt[type].map((item) => {
          if (item.id === itemId) {
            const nextWeight = Math.min(5, Math.max(1, item.weight + delta));
            return { ...item, weight: nextWeight };
          }
          return item;
        }),
      };
    });
    onUpdateAnalysis({ ...analysis, options: updatedOptions });
  };

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPointText.trim()) return;

    const newItem: ProConItem = {
      id: `custom-${Date.now()}`,
      point: newPointText.trim(),
      detail: newPointDetail.trim() || "User-added consideration",
      impact: newPointImpact,
      weight: newPointWeight,
      userCustom: true,
      userExcluded: false,
    };

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== selectedOptionId) return opt;
      return {
        ...opt,
        [newPointType === "pro" ? "pros" : "cons"]: [
          ...opt[newPointType === "pro" ? "pros" : "cons"],
          newItem,
        ],
      };
    });

    onUpdateAnalysis({ ...analysis, options: updatedOptions });
    setNewPointText("");
    setNewPointDetail("");
    setShowAddModal(false);
  };

  // Calculate scores for an option
  const calculateScores = (opt: OptionAnalysis) => {
    const activePros = opt.pros.filter((p) => !p.userExcluded);
    const activeCons = opt.cons.filter((c) => !c.userExcluded);

    const proWeightSum = activePros.reduce((acc, curr) => acc + curr.weight, 0);
    const conWeightSum = activeCons.reduce((acc, curr) => acc + curr.weight, 0);
    const net = proWeightSum - conWeightSum;

    return { proWeightSum, conWeightSum, net };
  };

  const currentOption =
    analysis.options.find((o) => o.id === selectedOptionId) || analysis.options[0];

  const getImpactBadge = (impact: ImpactLevel) => {
    switch (impact) {
      case "high":
        return (
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-bold tracking-wider border ${
              isPaper
                ? "bg-amber-100/70 text-amber-900 border-amber-300"
                : "bg-zinc-800 text-amber-400 border-zinc-700"
            }`}
          >
            High Impact
          </span>
        );
      case "medium":
        return (
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-medium tracking-wider border ${
              isPaper
                ? "bg-stone-100 text-stone-700 border-stone-300"
                : "bg-zinc-800/80 text-zinc-400 border-zinc-700"
            }`}
          >
            Medium
          </span>
        );
      case "low":
        return (
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-mono text-zinc-500 border ${
              isPaper
                ? "bg-stone-50 text-stone-500 border-stone-200"
                : "bg-zinc-900 text-zinc-500 border-zinc-800"
            }`}
          >
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Segmented Control */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${
          isPaper ? "border-stone-300" : "border-zinc-800"
        }`}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {analysis.options.map((opt) => {
            const { net } = calculateScores(opt);
            const isSelected = opt.id === selectedOptionId;
            return (
              <button
                key={opt.id}
                id={`tab-option-${opt.id}`}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-2 whitespace-nowrap cursor-pointer active:translate-y-[0.5px] border ${
                  isSelected
                    ? isPaper
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs font-semibold"
                      : "bg-zinc-800 text-white border-zinc-600 font-semibold"
                    : isPaper
                    ? "bg-white hover:bg-stone-100 text-stone-700 border-stone-300 shadow-xs"
                    : "bg-[#15161A] hover:bg-[#1C1E24] text-zinc-400 border-zinc-800"
                }`}
              >
                <span>{opt.title}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isSelected
                      ? isPaper
                        ? "bg-stone-800 text-white"
                        : "bg-zinc-900 text-amber-400"
                      : net >= 0
                      ? isPaper
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-emerald-950/70 text-emerald-400"
                      : isPaper
                      ? "bg-rose-100 text-rose-800"
                      : "bg-rose-950/70 text-rose-400"
                  }`}
                >
                  {net > 0 ? `+${net}` : net}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-factor"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer active:translate-y-[0.5px] ${
            isPaper
              ? "bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs"
              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Factor</span>
        </button>
      </div>

      {/* Current Option Header & Balance Ledger */}
      {currentOption && (
        <div
          className={`border rounded-xl p-5 transition ${
            isPaper
              ? "bg-white border-stone-300 text-stone-900 shadow-xs"
              : "bg-[#15161A] border-zinc-800 text-zinc-100"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg sm:text-xl font-serif font-bold ${
                    isPaper ? "text-stone-900" : "text-white"
                  }`}
                >
                  {currentOption.title}
                </h3>
                {currentOption.id === analysis.tiebreakerVerdict.recommendedOptionId && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                      isPaper
                        ? "bg-stone-100 text-stone-800 border-stone-300"
                        : "bg-zinc-800 text-amber-400 border-zinc-700"
                    }`}
                  >
                    Recommended
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isPaper ? "text-stone-500" : "text-zinc-400"
                }`}
              >
                {currentOption.tagline}
              </p>
            </div>

            {/* Score Summary Metrics */}
            {(() => {
              const { proWeightSum, conWeightSum, net } = calculateScores(currentOption);
              return (
                <div
                  className={`flex items-center gap-4 px-4 py-2 rounded-lg border font-mono ${
                    isPaper
                      ? "bg-stone-50 border-stone-200"
                      : "bg-[#0E0F12] border-zinc-800"
                  }`}
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Pros (+W)
                    </div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{proWeightSum}
                    </div>
                  </div>
                  <div
                    className={`h-6 w-px ${
                      isPaper ? "bg-stone-300" : "bg-zinc-800"
                    }`}
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Cons (-W)
                    </div>
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      -{conWeightSum}
                    </div>
                  </div>
                  <div
                    className={`h-6 w-px ${
                      isPaper ? "bg-stone-300" : "bg-zinc-800"
                    }`}
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                      Net Balance
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        net >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {net > 0 ? `+${net}` : net}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Pros & Cons Columns - Real Physical Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {/* Pros Column */}
            <div
              className={`border rounded-lg p-4 ${
                isPaper
                  ? "bg-[#FCFAF7] border-stone-300"
                  : "bg-[#111215] border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-inherit">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                  <span>Weighted Advantages (Pros)</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {currentOption.pros.filter((p) => !p.userExcluded).length} Active
                </span>
              </div>

              <div className="space-y-2.5">
                {currentOption.pros.map((pro) => (
                  <div
                    key={pro.id}
                    className={`p-3 rounded-md border transition ${
                      pro.userExcluded
                        ? "opacity-40 line-through bg-stone-100/50 dark:bg-zinc-900 border-dashed border-stone-300 dark:border-zinc-800"
                        : isPaper
                        ? "bg-white border-stone-300/80 text-stone-800 shadow-xs"
                        : "bg-[#16171B] border-zinc-800 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          +{pro.weight}
                        </span>
                        <span className="text-xs font-semibold leading-snug">
                          {pro.point}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {getImpactBadge(pro.impact)}
                        <button
                          onClick={() => handleToggleItem(currentOption.id, pro.id, "pros")}
                          className={`p-1 rounded transition text-[11px] cursor-pointer ${
                            pro.userExcluded
                              ? "text-emerald-600 hover:text-emerald-700"
                              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          }`}
                          title={pro.userExcluded ? "Include factor" : "Exclude factor"}
                        >
                          {pro.userExcluded ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isPaper ? "text-stone-600" : "text-zinc-400"
                      }`}
                    >
                      {pro.detail}
                    </p>

                    {/* Weight adjustments */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-inherit text-[11px]">
                      <span className="text-zinc-500 font-mono">Weight factor:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={pro.weight <= 1 || pro.userExcluded}
                          onClick={() => handleAdjustWeight(currentOption.id, pro.id, "pros", -1)}
                          className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold w-4 text-center">
                          {pro.weight}
                        </span>
                        <button
                          disabled={pro.weight >= 5 || pro.userExcluded}
                          onClick={() => handleAdjustWeight(currentOption.id, pro.id, "pros", 1)}
                          className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons Column */}
            <div
              className={`border rounded-lg p-4 ${
                isPaper
                  ? "bg-[#FCFAF7] border-stone-300"
                  : "bg-[#111215] border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-inherit">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-rose-700 dark:text-rose-400">
                  <ArrowDownRight className="w-4 h-4 stroke-[2.2]" />
                  <span>Weighted Risks & Costs (Cons)</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {currentOption.cons.filter((c) => !c.userExcluded).length} Active
                </span>
              </div>

              <div className="space-y-2.5">
                {currentOption.cons.map((con) => (
                  <div
                    key={con.id}
                    className={`p-3 rounded-md border transition ${
                      con.userExcluded
                        ? "opacity-40 line-through bg-stone-100/50 dark:bg-zinc-900 border-dashed border-stone-300 dark:border-zinc-800"
                        : isPaper
                        ? "bg-white border-stone-300/80 text-stone-800 shadow-xs"
                        : "bg-[#16171B] border-zinc-800 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold font-mono px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                          -{con.weight}
                        </span>
                        <span className="text-xs font-semibold leading-snug">
                          {con.point}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {getImpactBadge(con.impact)}
                        <button
                          onClick={() => handleToggleItem(currentOption.id, con.id, "cons")}
                          className={`p-1 rounded transition text-[11px] cursor-pointer ${
                            con.userExcluded
                              ? "text-rose-600 hover:text-rose-700"
                              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                          }`}
                          title={con.userExcluded ? "Include factor" : "Exclude factor"}
                        >
                          {con.userExcluded ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isPaper ? "text-stone-600" : "text-zinc-400"
                      }`}
                    >
                      {con.detail}
                    </p>

                    {/* Weight adjustments */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-inherit text-[11px]">
                      <span className="text-zinc-500 font-mono">Weight factor:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={con.weight <= 1 || con.userExcluded}
                          onClick={() => handleAdjustWeight(currentOption.id, con.id, "cons", -1)}
                          className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold w-4 text-center">
                          {con.weight}
                        </span>
                        <button
                          disabled={con.weight >= 5 || con.userExcluded}
                          onClick={() => handleAdjustWeight(currentOption.id, con.id, "cons", 1)}
                          className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono hover:bg-stone-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Factor Modal - Clean Solid Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div
            className={`border rounded-xl max-w-md w-full p-5 shadow-lg ${
              isPaper
                ? "bg-white border-stone-300 text-stone-900"
                : "bg-[#15161A] border-zinc-700 text-zinc-100"
            }`}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
              <h4 className="text-sm font-serif font-bold">Add Custom Consideration</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5">
                  Type of Factor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPointType("pro")}
                    className={`py-1.5 text-xs font-semibold rounded-md border transition cursor-pointer ${
                      newPointType === "pro"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    Advantage (Pro)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPointType("con")}
                    className={`py-1.5 text-xs font-semibold rounded-md border transition cursor-pointer ${
                      newPointType === "con"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    Risk / Cost (Con)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                  Factor Name
                </label>
                <input
                  type="text"
                  required
                  value={newPointText}
                  onChange={(e) => setNewPointText(e.target.value)}
                  placeholder="e.g., Extended daily commute"
                  className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                    isPaper
                      ? "bg-stone-50 border-stone-300 focus:border-stone-700"
                      : "bg-[#0E0F12] border-zinc-700 focus:border-amber-400"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                  Supporting Context
                </label>
                <input
                  type="text"
                  value={newPointDetail}
                  onChange={(e) => setNewPointDetail(e.target.value)}
                  placeholder="e.g., Takes 45 min each way and requires tolls"
                  className={`w-full px-3 py-2 rounded-md border text-xs outline-none ${
                    isPaper
                      ? "bg-stone-50 border-stone-300 focus:border-stone-700"
                      : "bg-[#0E0F12] border-zinc-700 focus:border-amber-400"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                    Impact Rating
                  </label>
                  <select
                    value={newPointImpact}
                    onChange={(e) => setNewPointImpact(e.target.value as ImpactLevel)}
                    className={`w-full px-2.5 py-1.5 rounded-md border text-xs outline-none ${
                      isPaper
                        ? "bg-stone-50 border-stone-300"
                        : "bg-[#0E0F12] border-zinc-700"
                    }`}
                  >
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-1">
                    Weight (1 to 5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newPointWeight}
                    onChange={(e) => setNewPointWeight(Number(e.target.value))}
                    className={`w-full px-2.5 py-1.5 rounded-md border text-xs outline-none ${
                      isPaper
                        ? "bg-stone-50 border-stone-300"
                        : "bg-[#0E0F12] border-zinc-700"
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  Insert Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
