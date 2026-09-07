export type ImpactLevel = 'high' | 'medium' | 'low';

export interface ProConItem {
  id: string;
  point: string;
  detail: string;
  impact: ImpactLevel;
  weight: number; // 1 to 5
  userCustom?: boolean;
  userExcluded?: boolean;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  mitigationAdvice: string;
}

export interface OptionAnalysis {
  id: string;
  title: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SwotAnalysis;
}

export interface CriterionScore {
  optionId: string;
  score: number; // 1 - 10
  note: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  importance: 'crucial' | 'high' | 'moderate';
  scores: CriterionScore[];
  userWeight?: number; // 1 to 3 multiplier
}

export interface IfThenRule {
  condition: string;
  recommendation: string;
  rationale: string;
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  recommendedOptionTitle: string;
  confidencePercentage: number;
  coreDilemma: string;
  primaryReason: string;
  ifThenRules: IfThenRule[];
  regretMinimizationVerdict: string;
  immediateNextSteps: string[];
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  question: string;
  context?: string;
  summary: string;
  options: OptionAnalysis[];
  comparisonMatrix: {
    criteria: ComparisonCriterion[];
  };
  tiebreakerVerdict: TiebreakerVerdict;
}

export interface FollowUpMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type ActiveTab = 'tiebreaker' | 'pros-cons' | 'comparison' | 'swot' | 'gut-check';

export type ThemeMode = 'paper' | 'slate';
