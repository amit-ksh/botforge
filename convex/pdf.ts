"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const getParsedPDF = action({
  args: { file: v.id("_storage") },
  handler: async (ctx, { file }) => {
    const blob = await ctx.storage.get(file);
    const loader = new PDFLoader(blob!);
    const pageLevelDocs = await loader.load();

    return JSON.stringify(pageLevelDocs);
  },
});
