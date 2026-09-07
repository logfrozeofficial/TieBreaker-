import React, { useState } from "react";
import { X, Trash2, Calendar, Search, ArrowRight, Award, FileText } from "lucide-react";
import { DecisionAnalysis, ThemeMode } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
  theme: ThemeMode;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const isPaper = theme === "paper";

  const filtered = savedDecisions.filter(
    (d) =>
      d.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tiebreakerVerdict.recommendedOptionTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div
        className={`border rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden transition ${
          isPaper
            ? "bg-white border-stone-300 text-stone-900"
            : "bg-[#15161A] border-zinc-700 text-zinc-100"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-inherit flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-serif font-bold">
              Decision Archive Vault
            </h3>
            <p className="text-xs text-zinc-500">
              {savedDecisions.length} stored {savedDecisions.length === 1 ? "record" : "records"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div
          className={`p-3 border-b flex items-center justify-between gap-3 ${
            isPaper
              ? "bg-stone-50 border-stone-200"
              : "bg-[#0E0F12] border-zinc-800"
          }`}
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search previous dilemmas or verdicts..."
              className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-xs outline-none ${
                isPaper
                  ? "bg-white border-stone-300 focus:border-stone-600 text-stone-900"
                  : "bg-[#15161A] border-zinc-700 focus:border-amber-400 text-white"
              }`}
            />
          </div>

          {savedDecisions.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Decision List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              {searchTerm ? "No records match your search criteria." : "No deliberations stored yet. Submit a dilemma to record it here automatically."}
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isPaper
                    ? "bg-stone-50/70 hover:bg-stone-100/80 border-stone-200"
                    : "bg-[#111215] hover:bg-[#181A20] border-zinc-800"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(d.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>•</span>
                    <span>{d.options.length} Paths</span>
                  </div>
                  <h4
                    className={`text-xs sm:text-sm font-semibold truncate mb-1 ${
                      isPaper ? "text-stone-950" : "text-white"
                    }`}
                  >
                    {d.question}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-mono">
                    <Award className="w-3.5 h-3.5" />
                    <span>Verdict: {d.tiebreakerVerdict.recommendedOptionTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectDecision(d);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer ${
                      isPaper
                        ? "bg-white hover:bg-stone-100 text-stone-800 border-stone-300"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700"
                    }`}
                  >
                    <span>Load Memo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteDecision(d.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
