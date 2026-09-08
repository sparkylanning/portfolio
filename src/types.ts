export interface CareerItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  tagline: string;
  description: string;
  achievements: string[];
  skills: string[];
  image: string;
  projectUrl?: string;
  featuredQuote?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  organization: string;
  period: string;
  tagline: string;
  description: string;
  keyOutcomes: string[];
  toolsUsed: string[];
  image: string;
  projectUrl?: string;
}

export interface PersonalItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
}

export interface SkillBubbleItem {
  id: string;
  name: string;
  category: "operations" | "analytics" | "finance" | "soft-skills" | "tools";
  categoryLabel: string;
  size: "lg" | "md" | "sm";
  context: string;
}

export interface ApproachPillar {
  id: string;
  title: string;
  description: string;
}

export interface ProfileData {
  name: string;
  firstName: string;
  roleNoun: string; // e.g. "operator." or "analyst."
  roleFull: string;
  tagline: string;
  location: string;
  university: string;
  degree: string;
  graduationYear: string;
  aboutHeadline?: string;
  shortBio: string;
  bioParagraph2?: string;
  avatarImage: string;
  email?: string;
  formEndpoint?: string;
  resumeUrl?: string;
  resumeName?: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  approachPillars?: ApproachPillar[];
}
