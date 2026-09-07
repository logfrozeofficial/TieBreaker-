import React, { useState } from "react";
import { Send, MessageSquare, User, Scale, ArrowRight, CornerDownLeft } from "lucide-react";
import { DecisionAnalysis, FollowUpMessage, ThemeMode } from "../types";

interface FollowUpChatProps {
  analysis: DecisionAnalysis;
  theme: ThemeMode;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ analysis, theme }) => {
  const [messages, setMessages] = useState<FollowUpMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isPaper = theme === "paper";

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userText = inputQuery.trim();
    const userMsg: FollowUpMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: analysis.question,
          options: analysis.options.map((o) => o.title),
          previousAnalysis: {
            summary: analysis.summary,
            tiebreakerVerdict: analysis.tiebreakerVerdict,
          },
          userQuery: userText,
        }),
      });

      if (!response.ok) {
        throw new Error("Follow up request failed");
      }

      const data = await response.json();
      const botMsg: FollowUpMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.answer || "I could not produce a response at this time.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: FollowUpMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an issue analyzing that condition. Please check your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`border rounded-xl p-5 sm:p-6 transition ${
        isPaper
          ? "bg-white border-stone-300 text-stone-900 shadow-xs"
          : "bg-[#15161A] border-zinc-800 text-zinc-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <MessageSquare className="w-4 h-4 opacity-70" />
        <h3
          className={`text-base font-serif font-bold ${
            isPaper ? "text-stone-900" : "text-white"
          }`}
        >
          Stress-Test The Recommendation
        </h3>
      </div>
      <p
        className={`text-xs mb-4 leading-relaxed ${
          isPaper ? "text-stone-500" : "text-zinc-400"
        }`}
      >
        Introduce new constraints, query exit ramps, or probe potential regret scenarios.
      </p>

      {/* Suggested prompts */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "What is the single worst-case scenario for the recommended option?",
            "What if I can negotiate a 15% compensation increase or flexible hours?",
            "How should I communicate this decision to my team or partner?",
            "What is the most reversible fallback plan if things go wrong?",
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputQuery(promptText)}
              className={`text-left text-xs px-2.5 py-1.5 rounded-md border transition cursor-pointer active:translate-y-[0.5px] ${
                isPaper
                  ? "bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-700"
                  : "bg-[#111215] hover:bg-[#1A1C22] border-zinc-800 text-zinc-300"
              }`}
            >
              "{promptText}"
            </button>
          ))}
        </div>
      )}

      {/* Message History Transcript */}
      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1 font-sans">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-lg text-xs sm:text-sm leading-relaxed border ${
                msg.role === "user"
                  ? isPaper
                    ? "bg-stone-100 border-stone-300 text-stone-900 ml-6"
                    : "bg-[#1E2026] border-zinc-700 text-zinc-200 ml-6"
                  : isPaper
                  ? "bg-white border-stone-300 text-stone-800 mr-6 shadow-xs"
                  : "bg-[#0E0F12] border-zinc-800 text-zinc-200 mr-6"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase font-mono text-zinc-500 mb-1.5 pb-1 border-b border-inherit">
                <span className="flex items-center gap-1 font-bold">
                  {msg.role === "user" ? (
                    <>
                      <User className="w-3 h-3" />
                      <span>You</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-700 dark:text-amber-400">
                        Deliberation Counsel
                      </span>
                    </>
                  )}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}

          {isLoading && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 mr-6 ${
                isPaper
                  ? "bg-stone-50 border-stone-300 text-stone-600"
                  : "bg-[#0E0F12] border-zinc-800 text-zinc-400"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin ${
                  isPaper ? "border-stone-800" : "border-amber-400"
                }`}
              />
              <span className="font-mono">Evaluating counterfactuals...</span>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Type a what-if query or challenge a premise..."
          className={`flex-1 px-3 py-2 rounded-lg border text-xs sm:text-sm outline-none transition ${
            isPaper
              ? "bg-[#FCFAF7] border-stone-300 focus:border-stone-600 text-stone-900 placeholder:text-stone-400"
              : "bg-[#0E0F12] border-zinc-700 focus:border-amber-500 text-white placeholder:text-zinc-600"
          }`}
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer active:translate-y-[0.5px] disabled:opacity-50 ${
            isPaper
              ? "bg-stone-900 hover:bg-stone-800 text-white border border-stone-900 shadow-xs"
              : "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border border-amber-400"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Submit</span>
        </button>
      </form>
    </div>
  );
};
