import React, { useState } from "react";
import { Plus, Trash2, SlidersHorizontal, ArrowRight, Briefcase, Home, Compass, GraduationCap, Scale } from "lucide-react";
import { PRESET_DECISIONS, PresetDecision } from "../data/presets";
import { ThemeMode } from "../types";

interface DecisionInputFormProps {
  onSubmit: (question: string, options: string[], context: string) => void;
  isLoading: boolean;
  theme: ThemeMode;
}

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  onSubmit,
  isLoading,
  theme,
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [context, setContext] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isPaper = theme === "paper";

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleLoadPreset = (preset: PresetDecision) => {
    setQuestion(preset.question);
    setOptions(preset.options);
    setContext(preset.context);
    setShowAdvanced(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    onSubmit(question.trim(), validOptions, context.trim());
  };

  const getPresetIcon = (iconName: string) => {
    const iconClass = `w-3.5 h-3.5 ${isPaper ? "text-stone-700" : "text-amber-400"}`;
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className={iconClass} />;
      case "Home":
        return <Home className={iconClass} />;
      case "Compass":
        return <Compass className={iconClass} />;
      case "GraduationCap":
        return <GraduationCap className={iconClass} />;
      default:
        return <Scale className={iconClass} />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2">
      {/* Editorial Headline */}
      <div className="text-center mb-8">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider mb-3.5 border ${
            isPaper
              ? "bg-stone-200/60 text-stone-700 border-stone-300"
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          <Scale className="w-3 h-3 stroke-[2.2]" />
          <span>Strategic Choice Worksheet</span>
        </div>
        <h2
          className={`text-2xl sm:text-4xl font-serif font-bold tracking-tight mb-3 ${
            isPaper ? "text-stone-900" : "text-white"
          }`}
        >
          Articulate your decision crossroads.
        </h2>
        <p
          className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${
            isPaper ? "text-stone-600" : "text-zinc-400"
          }`}
        >
          Break down competing paths with weighted pro/con accounting, 2×2 SWOT analysis, and a definitive tiebreaker recommendation.
        </p>
      </div>

      {/* Preset Reference Scenarios */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
              isPaper ? "text-stone-500" : "text-zinc-500"
            }`}
          >
            Or load an archetypal dilemma:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_DECISIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-btn-${idx}`}
              onClick={() => handleLoadPreset(preset)}
              className={`flex items-center gap-3 p-2.5 text-left rounded-lg border transition text-xs cursor-pointer active:translate-y-[0.5px] ${
                isPaper
                  ? "bg-white hover:bg-stone-50 border-stone-300 text-stone-800 shadow-xs"
                  : "bg-[#16171B] hover:bg-[#1E2025] border-zinc-800 text-zinc-300"
              }`}
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center shrink-0 border ${
                  isPaper
                    ? "bg-stone-100 border-stone-200"
                    : "bg-zinc-800 border-zinc-700"
                }`}
              >
                {getPresetIcon(preset.icon)}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`font-semibold truncate ${
                    isPaper ? "text-stone-900" : "text-zinc-200"
                  }`}
                >
                  {preset.title}
                </div>
                <div
                  className={`text-[11px] truncate ${
                    isPaper ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  {preset.question}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form Worksheet */}
      <form
        onSubmit={handleSubmit}
        className={`border rounded-xl p-5 sm:p-7 shadow-xs transition-colors ${
          isPaper
            ? "bg-white border-stone-300/90 text-stone-900"
            : "bg-[#15161A] border-zinc-800 text-zinc-100"
        }`}
      >
        {/* The Question */}
        <div className="mb-6">
          <label
            htmlFor="decision-question"
            className={`block text-xs font-mono uppercase tracking-wider font-semibold mb-2 ${
              isPaper ? "text-stone-700" : "text-zinc-300"
            }`}
          >
            The Primary Dilemma <span className="text-amber-600">*</span>
          </label>
          <textarea
            id="decision-question"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Should I accept the senior manager offer at Startup X or remain at my current corporate position?"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition resize-none ${
              isPaper
                ? "bg-[#FCFAF7] border-stone-300 focus:border-stone-600 text-stone-900 placeholder:text-stone-400"
                : "bg-[#0E0F12] border-zinc-700 focus:border-amber-500 text-white placeholder:text-zinc-600"
            }`}
            required
          />
        </div>

        {/* Options to compare */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              className={`block text-xs font-mono uppercase tracking-wider font-semibold ${
                isPaper ? "text-stone-700" : "text-zinc-300"
              }`}
            >
              Options Under Evaluation
            </label>
            <span
              className={`text-[11px] ${
                isPaper ? "text-stone-500" : "text-zinc-500"
              }`}
            >
              (Leave blank for binary Yes / No)
            </span>
          </div>

          <div className="space-y-2">
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={`w-6 text-xs font-mono font-bold text-center ${
                    isPaper ? "text-stone-500" : "text-zinc-500"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <input
                  type="text"
                  id={`option-input-${index}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? "e.g., Accept the startup offer"
                      : index === 1
                      ? "e.g., Remain at corporate position"
                      : `e.g., Alternative Option ${index + 1}`
                  }
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none transition ${
                    isPaper
                      ? "bg-[#FCFAF7] border-stone-300 focus:border-stone-600 text-stone-900 placeholder:text-stone-400"
                      : "bg-[#0E0F12] border-zinc-700 focus:border-amber-500 text-white placeholder:text-zinc-600"
                  }`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className={`p-1.5 rounded transition cursor-pointer ${
                      isPaper
                        ? "text-stone-400 hover:text-rose-600 hover:bg-stone-100"
                        : "text-zinc-500 hover:text-rose-400 hover:bg-zinc-800"
                    }`}
                    title="Remove this option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 4 && (
            <button
              type="button"
              id="btn-add-option"
              onClick={handleAddOption}
              className={`mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium transition px-2 py-1 rounded cursor-pointer ${
                isPaper
                  ? "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
                  : "text-amber-400 hover:text-amber-300 hover:bg-zinc-800"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add another path</span>
            </button>
          )}
        </div>

        {/* Advanced Constraints Toggle */}
        <div
          className={`mb-6 pt-4 border-t ${
            isPaper ? "border-stone-200" : "border-zinc-800"
          }`}
        >
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-2 text-xs font-medium transition cursor-pointer ${
              isPaper
                ? "text-stone-600 hover:text-stone-900"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 opacity-70" />
            <span>
              {showAdvanced
                ? "Hide Context & Key Constraints"
                : "+ Add Timeline, Financial Buffer & Values Constraints (Optional)"}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-3">
              <textarea
                id="decision-context"
                rows={2}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Specific boundary conditions (e.g., 'Have 6 months savings buffer; high commute aversion; family relocation restricted; must respond by next Tuesday')."
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm outline-none transition resize-none ${
                  isPaper
                    ? "bg-[#FCFAF7] border-stone-300 focus:border-stone-600 text-stone-900 placeholder:text-stone-400"
                    : "bg-[#0E0F12] border-zinc-700 focus:border-amber-500 text-white placeholder:text-zinc-600"
                }`}
              />
            </div>
          )}
        </div>

        {/* Submit Button - Solid, Real, High Contrast */}
        <button
          type="submit"
          id="btn-submit-decision"
          disabled={isLoading || !question.trim()}
          className={`w-full py-3 px-5 rounded-lg font-semibold text-xs sm:text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed ${
            isPaper
              ? "bg-stone-900 hover:bg-stone-800 text-white border border-stone-900 shadow-xs"
              : "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border border-amber-400"
          }`}
        >
          {isLoading ? (
            <>
              <div
                className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  isPaper ? "border-white" : "border-zinc-950"
                }`}
              />
              <span>Synthesizing Evaluation Matrix...</span>
            </>
          ) : (
            <>
              <span>Deliberate & Break The Tie</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
