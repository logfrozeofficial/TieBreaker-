import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Comprehensive decision analysis endpoint
app.post("/api/analyze-decision", async (req, res) => {
  try {
    const { question, options, context } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Please provide a decision question or dilemma." });
    }

    const cleanedOptions = Array.isArray(options) && options.length > 0
      ? options.map((opt: unknown) => String(opt).trim()).filter(Boolean)
      : [];

    const ai = getAIClient();

    const prompt = `
You are "The Tiebreaker", a world-class strategic decision advisor, executive mentor, and cognitive clarity engine.
Your goal is to thoroughly analyze a difficult decision, deliver balanced pros & cons, a detailed comparison matrix across key decision criteria, a full SWOT analysis for each option, and an authoritative "Tiebreaker Verdict" that cuts through analysis paralysis.

Decision Dilemma: "${question.trim()}"
Options Provided: ${cleanedOptions.length > 0 ? cleanedOptions.map((o: string, i: number) => `Option ${i + 1}: ${o}`).join(", ") : "Infer the 2 most natural opposing choices (e.g. Option A vs Option B, or Yes/Do It vs No/Don't Do It)."}
${context ? `Additional Context / Personal Constraints: "${context.trim()}"` : ""}

Conduct a meticulous evaluation:
1. Provide a concise executive overview of the decision landscape.
2. For EACH option:
   - Provide 3 to 5 distinct Pros with impact rating ('high', 'medium', 'low') and weight score (1 to 5).
   - Provide 3 to 5 distinct Cons with impact rating ('high', 'medium', 'low') and weight score (1 to 5).
   - Provide a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats), plus a key strategic mitigation tip.
3. Construct a Comparison Matrix comparing the options across 4 to 6 critical criteria (such as Long-term Upside, Financial/Resource Cost, Emotional & Stress Impact, Risk & Reversibility, Alignment with Personal Growth, etc.). Rate each option from 1 to 10 with a concise rationale note.
4. Deliver "The Tiebreaker Verdict":
   - Identify the single Core Dilemma / Trade-off at the heart of this choice (e.g., "Freedom vs Security", "Short-term Comfort vs Compounding Career Upside").
   - Decisive Recommendation: which option edges out and why.
   - If-Then Decision Rules (e.g. "Choose Option A IF..., Choose Option B IF...").
   - Regret Minimization Framework (Jeff Bezos model: looking back in 10 or 20 years, what regret hurts more?).
   - Immediate 3-step action plan to move forward without lingering second-guessing.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are The Tiebreaker, an expert decision strategist. Always return strictly valid JSON matching the requested schema with deep, insightful, non-generic points.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A 2-3 sentence strategic summary framing the stakes of this decision."
            },
            options: {
              type: Type.ARRAY,
              description: "The evaluated options",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        detail: { type: Type.STRING },
                        impact: { type: Type.STRING, description: "'high', 'medium', or 'low'" },
                        weight: { type: Type.INTEGER, description: "1 to 5 points" }
                      },
                      required: ["id", "point", "detail", "impact", "weight"]
                    }
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        point: { type: Type.STRING },
                        detail: { type: Type.STRING },
                        impact: { type: Type.STRING, description: "'high', 'medium', or 'low'" },
                        weight: { type: Type.INTEGER, description: "1 to 5 points" }
                      },
                      required: ["id", "point", "detail", "impact", "weight"]
                    }
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                      mitigationAdvice: { type: Type.STRING }
                    },
                    required: ["strengths", "weaknesses", "opportunities", "threats", "mitigationAdvice"]
                  }
                },
                required: ["id", "title", "tagline", "pros", "cons", "swot"]
              }
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      importance: { type: Type.STRING, description: "'crucial', 'high', or 'moderate'" },
                      scores: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            score: { type: Type.INTEGER, description: "Rating from 1 to 10" },
                            note: { type: Type.STRING }
                          },
                          required: ["optionId", "score", "note"]
                        }
                      }
                    },
                    required: ["id", "name", "description", "importance", "scores"]
                  }
                }
              },
              required: ["criteria"]
            },
            tiebreakerVerdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionId: { type: Type.STRING },
                recommendedOptionTitle: { type: Type.STRING },
                confidencePercentage: { type: Type.INTEGER },
                coreDilemma: { type: Type.STRING },
                primaryReason: { type: Type.STRING },
                ifThenRules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      condition: { type: Type.STRING },
                      recommendation: { type: Type.STRING },
                      rationale: { type: Type.STRING }
                    },
                    required: ["condition", "recommendation", "rationale"]
                  }
                },
                regretMinimizationVerdict: { type: Type.STRING },
                immediateNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: [
                "recommendedOptionId",
                "recommendedOptionTitle",
                "confidencePercentage",
                "coreDilemma",
                "primaryReason",
                "ifThenRules",
                "regretMinimizationVerdict",
                "immediateNextSteps"
              ]
            }
          },
          required: ["summary", "options", "comparisonMatrix", "tiebreakerVerdict"]
        }
      }
    });

    const rawText = response.text || "{}";
    const data = JSON.parse(rawText);
    return res.json(data);
  } catch (error: any) {
    console.error("Error analyzing decision:", error);
    return res.status(500).json({
      error: error?.message || "Failed to analyze decision. Please verify your Gemini API key.",
    });
  }
});

// Follow-up consultation endpoint
app.post("/api/follow-up", async (req, res) => {
  try {
    const { question, options, previousAnalysis, userQuery } = req.body;

    if (!userQuery || typeof userQuery !== "string") {
      return res.status(400).json({ error: "Please provide a query." });
    }

    const ai = getAIClient();

    const prompt = `
You are The Tiebreaker decision assistant.
The user is deliberating: "${question}"
Options: ${JSON.stringify(options)}
Existing Analysis Summary: ${JSON.stringify(previousAnalysis?.summary || "")}
Core Dilemma: ${JSON.stringify(previousAnalysis?.tiebreakerVerdict?.coreDilemma || "")}
Recommended: ${JSON.stringify(previousAnalysis?.tiebreakerVerdict?.recommendedOptionTitle || "")}

User's Follow-up Question or New Constraint:
"${userQuery}"

Provide a crisp, actionable, high-clarity response (2-3 paragraphs or structured bullet points).
Address their specific condition, how it shifts the balance of the pros/cons, and give a clear bottom line.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are The Tiebreaker. Deliver direct, wise, actionable decision advice without fluff.",
      }
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in follow-up:", error);
    return res.status(500).json({
      error: error?.message || "Failed to answer follow-up query.",
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server running on port ${PORT}`);
  });
}

startServer();
