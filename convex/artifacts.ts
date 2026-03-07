import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const getByProject = query({
  args: { projectId: v.string() },
  handler: async (ctx, args) => {
    try {
      return await ctx.db
        .query("artifacts")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId as Id<"projects">))
        .first();
    } catch {
      return null;
    }
  },
});

export const upsert = mutation({
  args: {
    projectId: v.string(),
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
    const projectId = args.projectId as Id<"projects">;
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (existing) {
      const { projectId: _, ...updates } = args;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }
    return await ctx.db.insert("artifacts", { ...args, projectId });
  },
});

export const updateArtifact = mutation({
  args: {
    projectId: v.string(),
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const projectId = args.projectId as Id<"projects">;
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (!existing) throw new Error("Artifacts record not found");
    await ctx.db.patch(existing._id, { [args.key]: args.value });
  },
});

export const saveArch = mutation({
  args: {
    projectId: v.string(),
    archGraph: v.string(),
    archProse: v.string(),
    archStatusMessages: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = args.projectId as Id<"projects">;
    const existing = await ctx.db
      .query("artifacts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    const fields = { archGraph: args.archGraph, archProse: args.archProse, archStatusMessages: args.archStatusMessages };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("artifacts", { projectId, status: "generating", ...fields });
    }
  },
});

export const saveCompleted = mutation({
  args: {
    projectId: v.string(),
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
    const { projectId: rawId, ...artifactFields } = args;
    const projectId = rawId as Id<"projects">;
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
