export interface PresetDecision {
  title: string;
  category: string;
  question: string;
  options: string[];
  context: string;
  icon: string;
}

export const PRESET_DECISIONS: PresetDecision[] = [
  {
    title: "Career Pivot",
    category: "Career & Life",
    question: "Should I leave my stable corporate job to join an early-stage AI startup?",
    options: ["Join early-stage AI startup", "Stay at stable corporate job"],
    context: "I have 8 months of living expenses saved. Corporate job is comfortable but slow. Startup offers equity and faster growth, but higher workload.",
    icon: "Briefcase",
  },
  {
    title: "Housing Dilemma",
    category: "Finance & Living",
    question: "Should we buy a suburban starter home or keep renting in the city center?",
    options: ["Buy suburban home", "Continue renting in the city"],
    context: "Current interest rates are ~6.5%. Suburban home provides more space and stability for future family, but city rental keeps our commute to 15 mins and cultural lifestyle intact.",
    icon: "Home",
  },
  {
    title: "Relocation vs Roots",
    category: "Personal",
    question: "Should I accept a 2-year overseas transfer to London or remain in my current hometown?",
    options: ["Move to London for 2 years", "Stay in current city near family"],
    context: "I am 29 years old. Living abroad has been a lifelong aspiration, but my close-knit friend group and aging parents are here.",
    icon: "Compass",
  },
  {
    title: "Grad School vs Self-Made",
    category: "Education",
    question: "Should I invest $100k in an executive MBA or bootstrap a business with that capital?",
    options: ["Enroll in Executive MBA", "Self-fund & bootstrap business"],
    context: "Goal is long-term leadership/entrepreneurship. MBA offers prestige, alumni network, and safety net; bootstrapping offers real-world speed and no academic fluff.",
    icon: "GraduationCap",
  },
];
