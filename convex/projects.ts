import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    onboardingId: v.id("onboarding"),
    name: v.string(),
    idea: v.string(),
    description: v.optional(v.string()),
    mode: v.union(v.literal("internal"), v.literal("external")),
    dashboardStyle: v.union(v.literal("business"), v.literal("technical")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.insert("projects", {
      ...args,
      userId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOnboarding = query({
  args: { onboardingId: v.id("onboarding") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_onboarding", (q) => q.eq("onboardingId", args.onboardingId))
      .first();
  },
});

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    idea: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(id, filtered);
    }
  },
});
