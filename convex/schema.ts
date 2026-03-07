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
});
