import { mutation } from "./_generated/server";

const DEMO_DOCUMENTS = [
  {
    title: "SL Cloud Architecture Standards v3",
    content:
      "All production services must run in AWS EU-West-1 (Ireland) or AWS eu-central-2 (Zurich) regions. ECS Fargate is the preferred compute platform for containerized workloads. Lambda is permitted only for stateless, short-lived event handlers under 15 minutes. EC2 instances require architecture review board approval. All services must use VPC private subnets with NAT gateways. Public-facing endpoints must go through the API Gateway or Application Load Balancer. Infrastructure must be defined as code using Terraform or AWS CDK.",
    category: "tech",
    tags: ["cloud", "aws", "infrastructure", "architecture"],
  },
  {
    title: "Data Residency Policy CH-2023",
    content:
      "All personally identifiable information (PII) of Swiss Life policyholders must be stored exclusively within Switzerland or the European Economic Area. S3 buckets containing customer data must use the eu-central-2 (Zurich) region. Cross-border data transfers require explicit data processing agreements under FADP (Swiss Federal Act on Data Protection). Database backups containing PII must be encrypted at rest using AES-256 and must not leave EEA regions. Data classification: Level 1 (public), Level 2 (internal), Level 3 (confidential - requires encryption), Level 4 (secret - requires HSM-backed encryption and audit logging).",
    category: "legal",
    tags: ["data-residency", "pii", "compliance", "gdpr", "fadp"],
  },
  {
    title: "SSO Integration Guide v2",
    content:
      "All internal web applications must authenticate users via Swiss Life's Azure Active Directory tenant (tenant ID: sl-prod-aad). Supported protocols: OpenID Connect (preferred) and SAML 2.0. OAuth 2.0 authorization code flow with PKCE is mandatory for SPAs. Service-to-service authentication must use Azure AD Managed Identities or client credentials flow with rotating secrets stored in Azure Key Vault. Multi-factor authentication is enforced for all users accessing Level 3+ data. Session timeout: 8 hours for standard users, 1 hour for privileged access. JWT tokens must be validated against the Azure AD JWKS endpoint.",
    category: "tech",
    tags: ["sso", "azure-ad", "oidc", "authentication", "security"],
  },
  {
    title: "Policy Administration System (PAS) Integration Guide",
    content:
      "The Policy Administration System (PAS) is Swiss Life's core policy management platform. REST API available at https://pas-api.sl.internal/api/v2. Authentication via OAuth 2.0 client credentials (contact platform team for client ID/secret). Key endpoints: GET /policies/{id}, POST /policies, GET /policies/{id}/claims, GET /customers/{id}/policies. Rate limit: 500 requests/minute per client. The system uses PostgreSQL 14 as its primary database. A read replica is available at pas-replica.sl.internal for reporting queries. Webhook support for policy state changes at /api/v2/webhooks/subscribe. SLA: 99.9% uptime, P95 latency < 200ms.",
    category: "project",
    tags: ["pas", "policy", "api", "integration", "core-system"],
  },
  {
    title: "Claims Processing Service — Technical Overview",
    content:
      "The Claims Processing Service handles all insurance claim workflows. Built on Apache Kafka for event-driven processing. Key Kafka topics: claims.submitted (new claims), claims.under-review (under assessment), claims.approved (approved for payout), claims.rejected (rejected with reason), claims.paid (payment completed). Consumer group prefix convention: claims-<service-name>. The service exposes a REST API at https://claims.sl.internal/api/v1. Claim state machine: submitted → under-review → (approved | rejected) → paid. Average processing time: 2.3 days. High-priority claims (amount > CHF 50,000) are routed to senior adjusters. Integration with PAS for policy validation.",
    category: "project",
    tags: ["claims", "kafka", "events", "workflow", "integration"],
  },
  {
    title: "Approved Frontend Technology Stack",
    content:
      "Swiss Life approved frontend frameworks and libraries: React 18+ (primary choice for new projects), Next.js 14+ (for server-rendered applications requiring SEO or performance), Angular 17+ (for complex enterprise applications, legacy team preference). Not approved for new projects: Vue.js, Svelte, Ember. UI component library: internally maintained SL Design System (npm: @swiss-life/ui-kit). TypeScript is mandatory for all new frontend projects. State management: React Query for server state, Zustand for client state. Testing: Jest + React Testing Library. Build tools: Vite or Next.js built-in. All frontend apps must meet WCAG 2.1 AA accessibility standards.",
    category: "tech",
    tags: ["frontend", "react", "nextjs", "typescript", "approved-stack"],
  },
  {
    title: "Compliance Logging and Audit Requirements",
    content:
      "All user actions on Level 3+ data must be audit-logged. Mandatory log fields: timestamp (ISO 8601), user_id, action_type, resource_type, resource_id, ip_address, success (boolean), details (JSON). Logs must be shipped to the central ELK stack (Elasticsearch-Logstash-Kibana) at logs.sl.internal within 5 seconds. Audit logs must be retained for 10 years per Swiss insurance regulations. Log tampering is a compliance violation — logs must be write-once (use Elasticsearch with ILM). Application logs (INFO/ERROR) ship to the same ELK cluster with 90-day retention. Structured logging format: JSON. Library recommendation: Pino (Node.js) or Serilog (.NET).",
    category: "legal",
    tags: ["audit", "logging", "elk", "compliance", "data-retention"],
  },
  {
    title: "API Gateway Standards — Kong Enterprise",
    content:
      "All external-facing APIs must be proxied through Kong Enterprise API Gateway at api.swisslife.ch. Internal service-to-service calls may bypass Kong but must use mutual TLS (mTLS) within the VPC. Kong configuration must include: rate limiting (default: 1000 req/min per consumer), request/response logging, JWT validation plugin, CORS policy. New APIs require approval from the API governance board (submit via ServiceNow). API versioning convention: /v1, /v2 in the path. APIs must publish an OpenAPI 3.0 specification. Deprecation policy: minimum 12 months notice before retiring an API version. Kong Admin API is restricted to the platform team.",
    category: "tech",
    tags: ["api-gateway", "kong", "rate-limiting", "governance"],
  },
  {
    title: "HR Systems Integration — SAP SuccessFactors",
    content:
      "Swiss Life HR data is managed in SAP SuccessFactors. Direct SAP integration is not available for application teams. Instead, use the HR Integration Middleware API at https://hr-api.sl.internal/v1. Available endpoints: GET /employees/{id} (returns name, email, department, manager, cost_center), GET /employees?department=<dept>, GET /employees/{id}/roles, POST /employees/{id}/access-requests. Authentication: Azure AD service principal (request access from IAM team). The middleware syncs with SAP every 15 minutes. For real-time HR data, subscribe to the hr.employee-updated Kafka topic. Employee IDs use format: SL-{6 digits}. Cost center format: CC-{4 digits}.",
    category: "project",
    tags: ["hr", "sap", "integration", "employees"],
  },
  {
    title: "IT Project Budget Guidelines FY2024",
    content:
      "Infrastructure cost caps for internal IT projects by tier: Tier 1 (business critical, revenue-generating): no cap, requires CTO approval. Tier 2 (important operational, affects >100 employees): CHF 50,000/year infrastructure, CHF 200,000/year total project. Tier 3 (departmental tools, <100 employees): CHF 15,000/year infrastructure, CHF 80,000 total project. Cloud cost tagging is mandatory: all AWS resources must have tags: Project, CostCenter, Owner, Environment. Monthly cost reports sent to project owners via the FinOps dashboard. Reserved Instances must be used for workloads with >6 months predictable usage (saves 30-40%). Spot instances are allowed for batch processing and non-critical workloads.",
    category: "business",
    tags: ["budget", "cost", "governance", "finops", "tiers"],
  },
];

export const seedDocuments = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("documents").take(1);
    if (existing.length > 0) {
      return { message: "Documents already seeded", count: 0 };
    }

    let count = 0;
    for (const doc of DEMO_DOCUMENTS) {
      await ctx.db.insert("documents", doc);
      count++;
    }

    return { message: "Seeded successfully", count };
  },
});
