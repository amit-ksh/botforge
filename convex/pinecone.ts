import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";

import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";

const getPineconeIndex = async () => {
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

export const createVectorStore = async ({
  botId,
  message,
}: CreateVectorStoreParams) => {
  const pineconeIndex = await getPineconeIndex();

  const embedding = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
    pineconeIndex,
    namespace: botId,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  return results;
};

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
