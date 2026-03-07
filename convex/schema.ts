import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
      })
    ),
    status: v.union(v.literal("draft"), v.literal("submitted")),
  }),
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
