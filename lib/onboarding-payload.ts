// The structured payload that Stage 1 (Onboarding) produces
// and Stage 2 (Business Specs / Tech Specs) consumes.

export interface OnboardingPayload {
  // Core idea — the natural language description of the tool
  toolDescription: string;

  // Project configuration
  projectMode: "internal" | "external";

  // Users & roles
  userRoles: string;
  accessControl: string;

  // Workflows & processes
  keyWorkflows: string;
  approvals: string;
  notifications: string;

  // Uploaded files (stored as references/names for now)
  uploadedFiles: UploadedFile[];
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export function createEmptyPayload(): OnboardingPayload {
  return {
    toolDescription: "",
    projectMode: "internal",
    userRoles: "",
    accessControl: "",
    keyWorkflows: "",
    approvals: "",
    notifications: "",
    uploadedFiles: [],
  };
}
