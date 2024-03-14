import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
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

    if (!bot || bot.user === args.userId) {
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
