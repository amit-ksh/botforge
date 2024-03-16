import { paginationOptsValidator } from "convex/server";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { createVectorStore } from "./pinecone";

export const getMessagesOfBots = query({
  args: { botId: v.id("bot"), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("bot"), args.botId))
      .order("desc")
      .paginate(args.paginationOpts);

    return messages;
  },
});

export const send = mutation({
  args: { botId: v.id("bot"), message: v.string() },
  handler: async (ctx, args) => {
    const bot = await ctx.db.get(args.botId);

    if (!bot) {
      return new Response("Not Found", { status: 404 });
    }

    // save user message to DB
    await ctx.db.insert("message", {
      author: "user",
      text: args.message,
      bot: bot._id,
    });

    const context = createVectorStore({
      botId: bot._id,
      message: args.message,
    });

    // Query last 6 message for the context
    const previousMessages = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("bot"), bot._id))
      .order("desc")
      .take(6);

    const messageId = await ctx.db.insert("message", {
      author: "assistant",
      text: "...",
      bot: bot._id,
    });

    // Schedule an action that calls ChatGPT and updates the message.
    await ctx.scheduler.runAfter(0, internal.openai.chat, {
      context,
      messageId,
      message: args.message,
      messages: previousMessages,
    });
  },
});

// Updates a message with a new text
export const update = internalMutation({
  args: { messageId: v.id("message"), text: v.string() },
  handler: async (ctx, { messageId, text }) => {
    await ctx.db.patch(messageId, { text });
  },
});
