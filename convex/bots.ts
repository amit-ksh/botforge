import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { BotStatusType } from "./schema";
import { Id } from "./_generated/dataModel";

export const getUserBots = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const bots = await ctx.db
      .query("bot")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .order("desc")
      .take(10);
    return bots;
  },
});

export const getBotById = query({
  args: { id: v.id("bot"), userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.id);
    return bot;
  },
});

export const getBotContentFile = query({
  args: { fileId: v.optional(v.id("_storage")) },
  handler: async (ctx, args) => {
    if (!args.fileId) return null;
    return await ctx.storage.getUrl(args?.fileId);
  },
});

export const createBot = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    file: v.id("_storage"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const newBotId = await ctx.db.insert("bot", {
      name: args.name,
      description: args.description,
      content: args.file,
      status: "PROCESSING",
      user: args.userId,
      messages: [],
      apiKey: generateApiKey(),
    });

    await ctx.scheduler.runAfter(0, internal.pinecone.createVector, {
      file: args.file,
      id: newBotId,
    });

    return newBotId;
  },
});

export const deleteBot = mutation({
  args: {
    id: v.id("bot"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.id);

    if (!bot || bot.user !== args.userId) {
      return {
        code: 400,
      };
    }

    await ctx.db.delete(args.id);
    await ctx.storage.delete(bot.content);

    return {
      code: 200,
    };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateBotStatus = internalMutation({
  args: {
    botId: v.id("bot"),
    status: BotStatusType,
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.botId, { status: args.status });
  },
});

function generateApiKey() {
  const values = new Uint8Array(32);
  window.crypto.getRandomValues(values);
  const apiKey = Array.from(values)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

  return apiKey;
}
