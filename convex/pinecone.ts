import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";

import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

export const getPineconeIndex = async () => {
  const client = new PineconeClient();

  await client.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });

  return client.Index(process.env.PINECONE_INDEX_NAME!);
};

interface CreateVectorStoreParams {
  botId: Id<"bot">;
  message: string;
}

export const createVector = internalAction({
  args: { file: v.id("_storage"), id: v.id("bot") },
  handler: async (ctx, { file, id }) => {
    try {
      const pineconeIndex = await getPineconeIndex();

      const strResp = await ctx.runAction(api.pdf.getParsedPDF, {
        file,
      });
      const pageLevelDocs = JSON.parse(strResp);

      // vectorize and index entire document
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
        pineconeIndex,
        namespace: id,
      });

      await ctx.runMutation(internal.bots.updateBotStatus, {
        botId: id,
        status: "READY",
      });
    } catch (error) {
      console.error(error);
      await ctx.runMutation(internal.bots.updateBotStatus, {
        botId: id,
        status: "FAILED",
      });
    }
  },
});

export const searchAndChat = action({
  args: { botId: v.id("bot"), message: v.string() },
  handler: async (ctx, { botId, message }: CreateVectorStoreParams) => {
    const pineconeIndex = await getPineconeIndex();

    const embedding = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
      pineconeIndex,
      namespace: botId,
    });

    const context = await vectorStore.similaritySearch(message, 4);

    // Query last 6 message for the context
    const previousMessages = await ctx.runQuery(api.messages.getMessages, {
      botId,
      take: 6,
    });

    const messageId = await ctx.runMutation(api.messages.create, {
      author: "assistant",
      text: "...",
      botId,
    });

    // Schedule an action that calls ChatGPT and updates the message.
    await ctx.scheduler.runAfter(0, internal.openai.chat, {
      data: JSON.stringify({
        context,
        messageId,
        message,
        messages: previousMessages,
      }),
    });
  },
});
