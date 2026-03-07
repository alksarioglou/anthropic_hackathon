import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    id: v.optional(v.id("onboarding")),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return await ctx.db.insert("onboarding", data);
  },
});

export const get = query({
  args: { id: v.id("onboarding") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
