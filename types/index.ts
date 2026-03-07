export type ProjectMode = "internal" | "external";
export type DashboardStyle = "business" | "technical";

export type ArtifactType =
  | "vision"
  | "requirements"
  | "architecture"
  | "frameworks"
  | "backlog"
  | "tests"
  | "competitive_analysis"
  | "cost_estimate";

export interface Project {
  id: string;
  name: string;
  idea: string;
  mode: ProjectMode;
  dashboardStyle: DashboardStyle;
  createdAt: number;
}

export type Artifacts = Partial<Record<ArtifactType, string>>;

export interface ArtifactDiff {
  artifactType: ArtifactType;
  label: string;
  before: string;
  after: string;
  summary: string;
}

export interface FeedbackResult {
  refinement: string;
  targetArtifact: ArtifactType;
  affectedArtifacts: ArtifactType[];
  reasoning: string;
  diffs: ArtifactDiff[];
  updatedArtifacts: Artifacts;
}

export interface GenerateRequest {
  idea: string;
  mode: ProjectMode;
  dashboardStyle: DashboardStyle;
}

export interface GenerateResponse {
  artifacts: Artifacts;
}

export interface FeedbackRequest {
  refinement: string;
  targetArtifact: ArtifactType;
  currentArtifacts: Artifacts;
  mode: ProjectMode;
}

export interface FeedbackResponse {
  result: FeedbackResult;
}

export const ARTIFACT_LABELS: Record<ArtifactType, string> = {
  vision: "Vision",
  requirements: "Requirements",
  architecture: "Architecture",
  frameworks: "Frameworks & Tech Stack",
  backlog: "Backlog",
  tests: "Test Definitions",
  competitive_analysis: "Competitive Analysis",
  cost_estimate: "Cost Estimate",
};

export const BUSINESS_ARTIFACTS: ArtifactType[] = [
  "vision",
  "requirements",
  "cost_estimate",
  "competitive_analysis",
];

export const TECH_ARTIFACTS: ArtifactType[] = [
  "vision",
  "requirements",
  "architecture",
  "frameworks",
  "backlog",
  "tests",
  "competitive_analysis",
];
