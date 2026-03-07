import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(), // "project" | "business" | "legal" | "tech"
    tags: v.array(v.string()),
  }).searchIndex("search_content", {
    searchField: "content",
    filterFields: ["category"],
  }),
  onboarding: defineTable({
    toolDescription: v.string(),
    projectMode: v.union(v.literal("internal"), v.literal("external")),
    userRoles: v.string(),
    accessControl: v.string(),
    keyWorkflows: v.string(),
    approvals: v.string(),
    notifications: v.string(),
    uploadedFiles: v.array(
      v.object({
        name: v.string(),
        size: v.number(),
        type: v.string(),
        content: v.optional(v.string()),
      })
    ),
    status: v.union(v.literal("draft"), v.literal("submitted")),
  }),
  projects: defineTable({
    onboardingId: v.id("onboarding"),
    userId: v.optional(v.string()),
    name: v.string(),
    idea: v.string(),
    description: v.optional(v.string()),
    mode: v.union(v.literal("internal"), v.literal("external")),
    dashboardStyle: v.union(v.literal("business"), v.literal("technical")),
    createdAt: v.number(),
  })
    .index("by_onboarding", ["onboardingId"])
    .index("by_user", ["userId"]),
  artifacts: defineTable({
    projectId: v.id("projects"),
    status: v.union(
      v.literal("generating"),
      v.literal("completed"),
      v.literal("error")
    ),
    vision: v.optional(v.string()),
    requirements: v.optional(v.string()),
    architecture: v.optional(v.string()),
    frameworks: v.optional(v.string()),
    backlog: v.optional(v.string()),
    tests: v.optional(v.string()),
    competitive_analysis: v.optional(v.string()),
    cost_estimate: v.optional(v.string()),
    error: v.optional(v.string()),
    archGraph: v.optional(v.string()),
    archGraphJson: v.optional(v.string()),
    archProse: v.optional(v.string()),
    archStatusMessages: v.optional(v.array(v.string())),
  }).index("by_project", ["projectId"]),
  techSpecs: defineTable({
    onboardingId: v.id("onboarding"),
    status: v.union(
      v.literal("pending"),
      v.literal("generating"),
      v.literal("completed"),
      v.literal("error")
    ),
    vision: v.optional(v.string()),
    requirements: v.optional(v.string()),
    architecture: v.optional(v.string()),
    frameworks: v.optional(v.string()),
    tests: v.optional(v.string()),
    backlog: v.optional(v.string()),
    error: v.optional(v.string()),
  }).index("by_onboarding", ["onboardingId"]),
});
