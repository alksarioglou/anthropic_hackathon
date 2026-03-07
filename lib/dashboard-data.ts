// Static dashboard data — will be replaced by Stage 2 agent output.
// Organized by: shared (both modes), internal-only, external-only.

export interface DashboardData {
  shared: SharedData;
  internal: InternalData;
  external: ExternalData;
}

// ─── SHARED (both internal & external) ──────────────────────────

export interface SharedData {
  businessCase: {
    summary: string;
    costBenefitItems: { label: string; value: string }[];
    roiProjection: string;
    goNoGoCriteria: string[];
    projectCharter: string;
    budgetAllocation: { category: string; amount: string; percent: number }[];
  };
  stakeholders: {
    map: { role: string; name: string; responsibility: string }[];
    raci: { task: string; responsible: string; accountable: string; consulted: string; informed: string }[];
    communicationPlan: string;
    escalationPaths: string;
  };
  successMetrics: {
    kpis: { metric: string; target: string; measurement: string }[];
    acceptanceCriteria: { requirement: string; criteria: string }[];
    traceabilityNote: string;
    qualityGates: { phase: string; gate: string }[];
  };
  timeline: {
    milestones: { name: string; date: string; status: "completed" | "in-progress" | "upcoming" }[];
    riskRegister: { risk: string; likelihood: "low" | "medium" | "high"; impact: "low" | "medium" | "high"; mitigation: string }[];
    assumptions: string[];
    constraints: string[];
  };
  operations: {
    deploymentStrategy: string;
    monitoringPlan: string;
    feedbackMechanism: string;
    definitionOfDone: string[];
  };
  glossary: { term: string; definition: string }[];
}

// ─── INTERNAL-ONLY ──────────────────────────────────────────────

export interface InternalData {
  painPoints: { who: string; problem: string; impact: string }[];
  buildVsBuy: {
    recommendation: string;
    options: { option: string; pros: string[]; cons: string[]; costEstimate: string }[];
  };
  trainingPlan: {
    approach: string;
    phases: { phase: string; audience: string; method: string }[];
  };
}

// ─── EXTERNAL-ONLY ──────────────────────────────────────────────

export interface ExternalData {
  compliance: {
    regulations: { name: string; requirement: string; status: string }[];
    privacyAssessment: string;
    licensingConsiderations: string;
  };
  userResearch: {
    personas: { name: string; role: string; goals: string; frustrations: string }[];
    journeyStages: { stage: string; actions: string; emotions: string; opportunities: string }[];
    jobsToBeDone: string[];
    marketResearch: { competitor: string; strength: string; gap: string }[];
  };
  designUx: {
    wireframeStatus: string;
    accessibilityRequirements: string[];
    localizationLanguages: string[];
  };
  slaAndRelease: {
    slaDefinitions: { metric: string; target: string; penalty: string }[];
    releaseNotes: string;
  };
  trainingPlan: {
    approach: string;
    phases: { phase: string; audience: string; method: string }[];
  };
}

// ─── STATIC SAMPLE DATA ────────────────────────────────────────

export const sampleData: DashboardData = {
  shared: {
    businessCase: {
      summary:
        "Replace fragmented incident tracking (email + spreadsheets) with a unified portal that cuts resolution time by 40% and provides full audit trails for compliance.",
      costBenefitItems: [
        { label: "Estimated Build Cost", value: "CHF 180,000 - 240,000" },
        { label: "Annual Operational Savings", value: "CHF 120,000" },
        { label: "Payback Period", value: "18-24 months" },
        { label: "5-Year Net Benefit", value: "CHF 360,000+" },
      ],
      roiProjection: "Projected 200% ROI over 5 years, driven by reduced incident resolution time, fewer compliance gaps, and elimination of manual tracking overhead.",
      goNoGoCriteria: [
        "Executive sponsor confirmed and budget approved",
        "Core team of 6 available for 16-week engagement",
        "IT infrastructure supports SSO and notification services",
        "At least 3 pilot teams willing to adopt in Phase 1",
        "Legal/compliance review of data handling completed",
      ],
      projectCharter:
        "Build an internal Incident & Change Management Portal that enables employees to report IT incidents, support teams to triage and resolve them, and important fixes to become tracked change requests with approval workflows. The portal will serve as the single source of truth for all operational incidents and changes.",
      budgetAllocation: [
        { category: "Development", amount: "CHF 120,000", percent: 50 },
        { category: "Design & UX", amount: "CHF 30,000", percent: 12 },
        { category: "Testing & QA", amount: "CHF 25,000", percent: 10 },
        { category: "Infrastructure", amount: "CHF 20,000", percent: 8 },
        { category: "Training & Rollout", amount: "CHF 25,000", percent: 10 },
        { category: "Contingency", amount: "CHF 24,000", percent: 10 },
      ],
    },
    stakeholders: {
      map: [
        { role: "Executive Sponsor", name: "CTO Office", responsibility: "Budget approval, strategic alignment" },
        { role: "Product Owner", name: "IT Operations Lead", responsibility: "Requirements, prioritization, acceptance" },
        { role: "End Users", name: "All employees (reporters)", responsibility: "Incident reporting, feedback" },
        { role: "Support Teams", name: "IT Support (L1/L2/L3)", responsibility: "Triage, resolution, change proposals" },
        { role: "Approvers", name: "Department Heads", responsibility: "Change request approval" },
        { role: "Compliance", name: "Legal & Risk", responsibility: "Regulatory review, audit requirements" },
      ],
      raci: [
        { task: "Incident Reporting", responsible: "Employees", accountable: "IT Ops Lead", consulted: "Support Teams", informed: "Management" },
        { task: "Triage & Assignment", responsible: "L1 Support", accountable: "IT Ops Lead", consulted: "L2/L3 Support", informed: "Reporter" },
        { task: "Change Request Approval", responsible: "Approvers", accountable: "CTO Office", consulted: "Support Teams", informed: "All stakeholders" },
        { task: "System Administration", responsible: "Admin Team", accountable: "IT Ops Lead", consulted: "Security", informed: "Support Teams" },
      ],
      communicationPlan: "Weekly status updates to stakeholders via dashboard reports. Slack channel for real-time team coordination. Monthly steering committee review for budget and timeline.",
      escalationPaths: "L1 → L2 (within 2 hours if unresolved) → L3 (within 4 hours) → IT Ops Lead (within 8 hours) → CTO Office (critical incidents only).",
    },
    successMetrics: {
      kpis: [
        { metric: "Mean Time to Resolution (MTTR)", target: "< 4 hours for P1, < 24 hours for P2", measurement: "Automated from incident timestamps" },
        { metric: "First Contact Resolution Rate", target: "> 60%", measurement: "Resolved at L1 without escalation" },
        { metric: "User Adoption Rate", target: "> 80% of employees within 3 months", measurement: "Unique reporters / total employees" },
        { metric: "Change Request Cycle Time", target: "< 5 business days from proposal to approval", measurement: "Automated from workflow timestamps" },
        { metric: "Audit Compliance Score", target: "100% of incidents with complete audit trails", measurement: "Automated completeness check" },
      ],
      acceptanceCriteria: [
        { requirement: "Incident Reporting", criteria: "Employee can submit an incident in under 2 minutes with all required fields" },
        { requirement: "Triage Workflow", criteria: "Support agent can triage and assign within 3 clicks from notification" },
        { requirement: "Approval Workflow", criteria: "Approver receives notification, can review context, and approve/reject in one screen" },
        { requirement: "Audit Trail", criteria: "Every state change is logged with timestamp, actor, and reason" },
      ],
      traceabilityNote:
        "Every requirement traces back to a business goal (reduce resolution time, ensure compliance, improve visibility). The traceability matrix ensures every CHF spent maps to measurable business value.",
      qualityGates: [
        { phase: "Requirements", gate: "All requirements have acceptance criteria and stakeholder sign-off" },
        { phase: "Design", gate: "Wireframes reviewed by 3+ end users, accessibility audit passed" },
        { phase: "Development", gate: "All acceptance criteria passing, code review completed" },
        { phase: "Pre-Launch", gate: "Pilot group testing complete, SLA monitoring active, training materials ready" },
      ],
    },
    timeline: {
      milestones: [
        { name: "Project Kickoff", date: "Week 1", status: "completed" },
        { name: "Requirements Sign-off", date: "Week 3", status: "completed" },
        { name: "Design Review", date: "Week 5", status: "in-progress" },
        { name: "MVP Development Complete", date: "Week 10", status: "upcoming" },
        { name: "Pilot Launch (3 teams)", date: "Week 12", status: "upcoming" },
        { name: "Full Rollout", date: "Week 16", status: "upcoming" },
      ],
      riskRegister: [
        { risk: "Low user adoption due to change resistance", likelihood: "medium", impact: "high", mitigation: "Champion program, phased rollout, training sessions" },
        { risk: "Integration delays with existing SSO/email systems", likelihood: "medium", impact: "medium", mitigation: "Early spike on integrations in Week 2" },
        { risk: "Scope creep from additional stakeholder requests", likelihood: "high", impact: "medium", mitigation: "Strict change control process, backlog prioritization" },
        { risk: "Data migration issues from existing spreadsheets", likelihood: "low", impact: "high", mitigation: "Dedicated migration sprint with validation checks" },
      ],
      assumptions: [
        "IT infrastructure supports modern web applications",
        "SSO provider API is available and documented",
        "Existing incident data can be exported in CSV/JSON format",
        "At least 3 pilot teams are available for testing",
        "Support teams have capacity for parallel operation during transition",
      ],
      constraints: [
        "Must launch before Q4 compliance audit",
        "Cannot exceed CHF 250,000 total budget",
        "Must integrate with existing Active Directory",
        "No external cloud services for data storage (data residency requirement)",
      ],
    },
    operations: {
      deploymentStrategy: "Phased rollout: Pilot with 3 teams (Week 12) → Department-wide (Week 14) → Full organization (Week 16). Each phase includes 48-hour monitoring period before expanding.",
      monitoringPlan: "Track MTTR, adoption rate, and user satisfaction weekly. Monthly business review comparing KPIs against targets. Automated alerts for SLA breaches.",
      feedbackMechanism: "In-app feedback button on every page. Monthly 5-minute user surveys. Quarterly stakeholder review sessions. Dedicated Slack channel for suggestions.",
      definitionOfDone: [
        "All acceptance criteria passing",
        "No critical or high-severity bugs",
        "Performance within SLA targets",
        "Documentation updated",
        "Training materials prepared",
        "Stakeholder sign-off obtained",
      ],
    },
    glossary: [
      { term: "Incident", definition: "An unplanned interruption or reduction in quality of an IT service" },
      { term: "Change Request", definition: "A formal proposal for a modification to any component of the IT infrastructure" },
      { term: "SLA", definition: "Service Level Agreement — a commitment between the service provider and the business on expected service levels" },
      { term: "MTTR", definition: "Mean Time to Resolution — the average time from incident report to confirmed resolution" },
      { term: "Triage", definition: "The process of assessing and classifying incoming incidents by severity and assigning to the right support tier" },
      { term: "Audit Trail", definition: "A chronological record of all actions taken on an incident or change request" },
    ],
  },
  internal: {
    painPoints: [
      { who: "Employees", problem: "No single place to report IT issues — currently use email, Slack DMs, or walk to IT desk", impact: "Average 30 min wasted per incident just finding the right person" },
      { who: "L1 Support", problem: "Incidents arrive via multiple channels with inconsistent information", impact: "40% of triage time spent gathering basic details" },
      { who: "Management", problem: "No visibility into incident volume, resolution times, or recurring issues", impact: "Cannot make data-driven decisions about IT staffing or infrastructure investment" },
      { who: "Compliance", problem: "No audit trail for incident handling or change approvals", impact: "Manual effort to reconstruct history for each audit cycle" },
    ],
    buildVsBuy: {
      recommendation: "Build — the specific workflow (incident → change request with internal approval chains) is unique enough that off-the-shelf tools would require significant customization that exceeds the cost of building.",
      options: [
        {
          option: "Build Custom",
          pros: ["Exact fit for internal workflows", "No per-seat licensing costs", "Full control over data and integrations", "Can evolve with organization"],
          cons: ["Higher upfront investment", "Requires development team", "Ongoing maintenance responsibility"],
          costEstimate: "CHF 180-240K build + CHF 30K/year maintenance",
        },
        {
          option: "Buy (ServiceNow)",
          pros: ["Enterprise-proven", "Rich out-of-box features", "Vendor support"],
          cons: ["CHF 80-120K/year licensing", "6+ months implementation", "Over-engineered for team size", "Customization is expensive"],
          costEstimate: "CHF 150K implementation + CHF 100K/year licensing",
        },
        {
          option: "Buy (Freshservice)",
          pros: ["Lower cost", "Quick setup", "Good incident management"],
          cons: ["Weak change management", "Limited approval workflows", "Data stored externally"],
          costEstimate: "CHF 40K/year licensing + CHF 50K customization",
        },
      ],
    },
    trainingPlan: {
      approach: "Role-based training delivered in 2 phases: pre-launch (support teams, admins) and launch week (all employees). Focus on hands-on practice with real scenarios.",
      phases: [
        { phase: "Pre-Launch (Week 11-12)", audience: "Support Teams & Admins", method: "2-hour interactive workshop + sandbox environment for practice" },
        { phase: "Launch Week (Week 12-13)", audience: "All Employees", method: "15-min video tutorial + quick-start guide + optional drop-in Q&A sessions" },
        { phase: "Post-Launch (Week 14+)", audience: "New joiners", method: "Self-service onboarding guide + buddy system with trained champions" },
      ],
    },
  },
  external: {
    compliance: {
      regulations: [
        { name: "FINMA", requirement: "Operational risk management requirements for outsourced IT services", status: "Assessment needed" },
        { name: "GDPR", requirement: "Data processing agreements, right to erasure, breach notification within 72 hours", status: "Framework in place" },
        { name: "Swiss FADP (nDSG)", requirement: "Cross-border data transfer restrictions, privacy impact assessments", status: "Review pending" },
        { name: "ISO 27001", requirement: "Information security management controls for incident handling", status: "Aligned" },
      ],
      privacyAssessment: "A full Data Privacy Impact Assessment (DPIA) is required because the tool processes client personal data in incident reports. Key areas: data minimization, access controls, retention policies, cross-border transfer safeguards, and breach notification procedures.",
      licensingConsiderations: "The tool is proprietary to the organization. Client data remains within the organization's infrastructure. No client-facing licensing needed. Internal intellectual property owned by the organization. Third-party library licenses must be reviewed for compatibility.",
    },
    userResearch: {
      personas: [
        { name: "Anna (Client Advisor)", role: "Front-office, daily client interaction", goals: "Report issues quickly without disrupting client meetings", frustrations: "Current process requires too many steps, no mobile access" },
        { name: "Marco (IT Manager)", role: "Manages support team of 8", goals: "Clear visibility into team workload and SLA performance", frustrations: "Spends 2 hours/day manually compiling status reports" },
        { name: "Sophie (Compliance Officer)", role: "Regulatory oversight", goals: "Complete audit trails without manual data collection", frustrations: "Cannot prove incident handling meets regulatory timelines" },
      ],
      journeyStages: [
        { stage: "Discover Issue", actions: "User encounters IT problem", emotions: "Frustrated, anxious", opportunities: "Simple, visible 'Report Issue' entry point" },
        { stage: "Report Incident", actions: "Fill in details, classify severity", emotions: "Hopeful, impatient", opportunities: "Smart defaults, auto-classification, < 2 min completion" },
        { stage: "Track Progress", actions: "Check status, receive updates", emotions: "Anxious, then relieved", opportunities: "Proactive notifications, clear status visualization" },
        { stage: "Resolution", actions: "Confirm fix, provide feedback", emotions: "Satisfied or frustrated", opportunities: "One-click confirmation, satisfaction survey" },
      ],
      jobsToBeDone: [
        "When I have an IT issue, I want to report it in under 2 minutes so I can get back to serving clients",
        "When I'm managing support, I want to see all open incidents at a glance so I can allocate resources effectively",
        "When an audit is coming, I want to generate a compliance report instantly so I don't spend weeks collecting data",
        "When a critical incident occurs, I want the right people notified automatically so response time is minimized",
      ],
      marketResearch: [
        { competitor: "ServiceNow", strength: "Enterprise ITSM leader with deep integrations", gap: "Expensive (CHF 100K+/year), complex, 6-month implementation" },
        { competitor: "Jira Service Management", strength: "Strong ticketing, Atlassian ecosystem", gap: "Limited change management, requires plugins for approval workflows" },
        { competitor: "Freshservice", strength: "User-friendly, good price/performance", gap: "Weak approval workflows, data stored externally (compliance risk)" },
      ],
    },
    designUx: {
      wireframeStatus: "Low-fidelity wireframes complete for core flows (incident reporting, triage dashboard, change request approval). High-fidelity prototypes scheduled for Week 4-5.",
      accessibilityRequirements: [
        "WCAG 2.1 Level AA compliance",
        "Screen reader compatible navigation",
        "Keyboard-only navigation support",
        "Minimum 4.5:1 color contrast ratio",
        "Focus indicators on all interactive elements",
      ],
      localizationLanguages: ["German (de-CH)", "French (fr-CH)", "Italian (it-CH)", "English (en)"],
    },
    slaAndRelease: {
      slaDefinitions: [
        { metric: "P1 (Critical) Response Time", target: "< 15 minutes", penalty: "CHF 500 per hour of delay" },
        { metric: "P1 (Critical) Resolution Time", target: "< 4 hours", penalty: "CHF 1,000 per hour of delay" },
        { metric: "P2 (High) Resolution Time", target: "< 24 hours", penalty: "Service credit" },
        { metric: "System Uptime", target: "99.9%", penalty: "Pro-rata service credit for downtime" },
      ],
      releaseNotes: "v1.0 — Initial release includes: incident reporting, triage workflow, change request management, role-based access, email notifications, and audit trail. Upcoming: SLA dashboards, mobile app, integration APIs.",
    },
    trainingPlan: {
      approach: "Client-facing training designed to drive adoption and reduce support costs. Multi-channel approach covering self-service, guided, and on-demand formats.",
      phases: [
        { phase: "Pre-Launch", audience: "Client Success Managers", method: "Train-the-trainer workshop (4 hours) + certification" },
        { phase: "Launch", audience: "Client Admins", method: "Interactive webinar + sandbox environment + quick-start guide" },
        { phase: "Ongoing", audience: "All client users", method: "In-app guided tours + video library + knowledge base + chat support" },
      ],
    },
  },
};
