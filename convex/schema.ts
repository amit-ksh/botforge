import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bot: defineTable({
    name: v.string(),
    description: v.string(),
    content: v.id("_storage"),
    status: v.union(
      v.literal("PROCESSING"),
      v.literal("FAILED"),
      v.literal("READY")
    ),
    user: v.string(),
    messages: v.array(v.id("messages")),
  }),
  message: defineTable({
    text: v.string(),
    messageBy: v.union(v.literal("USER"), v.literal("BOT"), v.literal("OWNER")),

    bot: v.optional(v.id("bot")),
  }),
});
