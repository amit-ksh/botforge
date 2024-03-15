import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

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
