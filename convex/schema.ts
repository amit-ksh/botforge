import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const BotStatusType = v.union(
  v.literal("PROCESSING"),
  v.literal("FAILED"),
  v.literal("READY")
);

export const AuthorTypes = v.union(v.literal("user"), v.literal("assistant"));

export default defineSchema({
  bot: defineTable({
    name: v.string(),
    description: v.string(),
    content: v.id("_storage"),
    status: BotStatusType,
    user: v.string(),
    messages: v.array(v.id("message")),
    apiKey: v.string(),
  }),
  message: defineTable({
    text: v.string(),
    author: AuthorTypes,

    bot: v.optional(v.id("bot")),
  }),
});
