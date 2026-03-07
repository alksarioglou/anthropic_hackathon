/**
 * ═══════════════════════════════════════════════════════════════════
 * STAGE 2 CONTRACT — Data interface for Technical Dashboard generation
 * ═══════════════════════════════════════════════════════════════════
 *
 * Owner: Jannis (Stage 2 — Technical Dashboard)
 *
 * PIPELINE:
 *   Stage 1 (ALK):  Onboarding → agentic processing → Business Dashboard
 *   Stage 2 (Jannis): Business Dashboard → [Convert to Tech] button → Technical Dashboard
 *   Stage 3 (Damiano): Feedback loop
 *
 * This file defines the data contract for Stage 2:
 *   INPUT  → OnboardingPayload + DashboardData (business dashboard)
 *            i.e. everything ALK's pipeline has produced
 *   OUTPUT → TechnicalDashboardData (what your agents must produce)
 *
 * When the user clicks "Convert to Technical Dashboard" on the
 * business dashboard, your agents receive the full Stage2Input
 * and must produce a TechnicalDashboardData object.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

// ─── INPUT: What Stage 2 receives ─────────────────────────────────
//
// Your agents get BOTH the raw onboarding answers AND the generated
// business dashboard. Use both to produce the technical dashboard.

export type { OnboardingPayload, UploadedFile } from "./onboarding-payload";
export type {
  DashboardData,
  SharedData,
  InternalData,
  ExternalData,
} from "./dashboard-data";

import type { OnboardingPayload } from "./onboarding-payload";
import type { DashboardData } from "./dashboard-data";

/**
 * The combined input your agents receive when the user clicks
 * "Convert to Technical Dashboard" on the business dashboard.
 */
export interface Stage2Input {
  /** Raw onboarding answers from the user */
  onboarding: OnboardingPayload;
  /** Generated business dashboard (output of ALK's agentic pipeline) */
  businessDashboard: DashboardData;
}

// ─── OUTPUT: What Stage 2 must produce ────────────────────────────
//
// Define your TechnicalDashboardData interface here.
// This is a placeholder — Jannis should expand it with the actual
// technical spec structure his agents will generate.

export interface TechnicalDashboardData {
  // TODO: Jannis — define the technical dashboard structure here.
  // Examples of what might go here:
  //   - System architecture (components, services, APIs)
  //   - Data model / schema design
  //   - Technology stack recommendations
  //   - API endpoint specifications
  //   - Infrastructure & deployment architecture
  //   - Security architecture
  //   - Integration specifications
  //   - Performance requirements & benchmarks
  //   - Development backlog (epics, stories, tasks)
  //   - Test plan & test cases
  [key: string]: unknown;
}

// ─── GENERATION GUIDE ─────────────────────────────────────────────

/**
 * Your agents receive Stage2Input and should leverage both sources:
 *
 * FROM onboarding (raw user input):
 *   toolDescription   → core idea, drives architecture decisions
 *   projectMode       → "internal" | "external", affects security/compliance depth
 *   userRoles         → drives access control architecture, API design
 *   accessControl     → drives auth/authz architecture
 *   keyWorkflows      → drives service design, state machines, API endpoints
 *   approvals         → drives workflow engine design, notification services
 *   notifications     → drives event/messaging architecture
 *   uploadedFiles     → supplementary context (specs, diagrams, etc.)
 *
 * FROM businessDashboard (ALK's generated output):
 *   shared.businessCase       → budget constraints, scope for tech decisions
 *   shared.stakeholders       → who needs what access, integration points
 *   shared.successMetrics     → drives performance requirements, monitoring
 *   shared.timeline           → drives sprint planning, phasing
 *   shared.operations         → drives deployment, CI/CD, monitoring architecture
 *   shared.glossary           → domain model, entity naming
 *
 *   internal.painPoints       → drives solution architecture priorities
 *   internal.buildVsBuy       → drives tech stack, integration vs build decisions
 *   internal.trainingPlan     → drives documentation requirements
 *
 *   external.compliance       → drives security architecture, data handling
 *   external.userResearch     → drives UX architecture, API design
 *   external.designUx         → drives frontend architecture, i18n setup
 *   external.slaAndRelease    → drives performance targets, SLA monitoring
 *   external.trainingPlan     → drives onboarding flows, API documentation
 *
 * Mode-specific sections (internal vs external) are populated based on
 * onboarding.projectMode — only the relevant mode's data will be filled.
 */

// ─── HELPERS ──────────────────────────────────────────────────────

/**
 * Assembles the Stage2Input from the two data sources.
 * Call this when the user clicks "Convert to Technical Dashboard".
 */
export function buildStage2Input(
  onboarding: OnboardingPayload,
  businessDashboard: DashboardData
): Stage2Input {
  return { onboarding, businessDashboard };
}

/**
 * Validates that the business dashboard has all required sections
 * before handing off to Stage 2. Returns a list of missing fields.
 * Empty list = ready for handoff.
 */
export function validateBusinessDashboard(
  data: DashboardData,
  projectMode: OnboardingPayload["projectMode"]
): string[] {
  const missing: string[] = [];

  // Shared validations
  if (!data.shared.businessCase.summary) missing.push("shared.businessCase.summary");
  if (data.shared.businessCase.costBenefitItems.length === 0) missing.push("shared.businessCase.costBenefitItems");
  if (data.shared.stakeholders.map.length === 0) missing.push("shared.stakeholders.map");
  if (data.shared.successMetrics.kpis.length === 0) missing.push("shared.successMetrics.kpis");
  if (data.shared.timeline.milestones.length === 0) missing.push("shared.timeline.milestones");
  if (!data.shared.operations.deploymentStrategy) missing.push("shared.operations.deploymentStrategy");
  if (data.shared.glossary.length === 0) missing.push("shared.glossary");

  // Mode-specific validations
  if (projectMode === "internal") {
    if (data.internal.painPoints.length === 0) missing.push("internal.painPoints");
    if (!data.internal.buildVsBuy.recommendation) missing.push("internal.buildVsBuy.recommendation");
    if (!data.internal.trainingPlan.approach) missing.push("internal.trainingPlan.approach");
  }

  if (projectMode === "external") {
    if (data.external.compliance.regulations.length === 0) missing.push("external.compliance.regulations");
    if (data.external.userResearch.personas.length === 0) missing.push("external.userResearch.personas");
    if (data.external.slaAndRelease.slaDefinitions.length === 0) missing.push("external.slaAndRelease.slaDefinitions");
    if (!data.external.trainingPlan.approach) missing.push("external.trainingPlan.approach");
  }

  return missing;
}
