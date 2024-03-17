import { paginationOptsValidator } from "convex/server";
import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

import { api } from "./_generated/api";
import { AuthorTypes } from "./schema";

export const getPaginatedMessages = query({
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

export const getMessages = query({
  args: { botId: v.id("bot"), take: v.number() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("message")
      .filter((q) => q.eq(q.field("bot"), args.botId))
      .order("desc")
      .take(args.take);

    return messages;
  },
});

export const create = mutation({
  args: { botId: v.id("bot"), text: v.string(), author: AuthorTypes },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("message", {
      author: args.author,
      text: args.text,
      bot: args.botId,
    });

    const bot = await ctx.db.get(args.botId);

    const updateMessages = !bot?.messages
      ? [messageId]
      : [...bot.messages, messageId];

    await ctx.db.patch(args.botId, {
      messages: updateMessages,
    });

    return messageId;
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
    await ctx.scheduler.runAfter(0, api.messages.create, {
      author: "user",
      text: args.message,
      botId: bot._id,
    });

    await ctx.scheduler.runAfter(0, api.pinecone.searchAndChat, {
      botId: bot._id,
      message: args.message,
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
