import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
  },
});

export const upsert = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    if (existing) {
      const { projectId: _, ...updates } = args;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }
    return await ctx.db.insert("artifacts", args);
  },
});

export const updateArtifact = mutation({
  args: {
    projectId: v.id("projects"),
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    if (!existing) throw new Error("Artifacts record not found");
    await ctx.db.patch(existing._id, { [args.key]: args.value });
  },
});

export const saveArch = mutation({
  args: {
    projectId: v.id("projects"),
    archGraph: v.string(),
    archProse: v.string(),
    archStatusMessages: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    const fields = { archGraph: args.archGraph, archProse: args.archProse, archStatusMessages: args.archStatusMessages };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("artifacts", { projectId: args.projectId, status: "generating", ...fields });
    }
  },
});

export const saveCompleted = mutation({
  args: {
    projectId: v.id("projects"),
    vision: v.optional(v.string()),
    requirements: v.optional(v.string()),
    architecture: v.optional(v.string()),
    frameworks: v.optional(v.string()),
    backlog: v.optional(v.string()),
    tests: v.optional(v.string()),
    competitive_analysis: v.optional(v.string()),
    cost_estimate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...artifactFields } = args;
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    const data = { projectId, status: "completed" as const, ...artifactFields };
    if (existing) {
      await ctx.db.patch(existing._id, { status: "completed", ...artifactFields });
      return existing._id;
    }
    return await ctx.db.insert("artifacts", data);
  },
});
