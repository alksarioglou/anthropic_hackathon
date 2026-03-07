import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const search = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchTerm, category, limit }) => {
    const results = await ctx.db
      .query("documents")
      .withSearchIndex("search_content", (q) => {
        const base = q.search("content", searchTerm);
        if (category) return base.eq("category", category);
        return base;
      })
      .take(limit ?? 5);

    return results.map((doc) => ({
      id: doc._id,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      tags: doc.tags,
    }));
  },
});

export const insert = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", args);
  },
});
