import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { httpRouter } from "convex/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { getPineconeIndex } from "./pinecone";
import OpenAI from "openai";
import { Doc, Id } from "./_generated/dataModel";

const http = httpRouter();

type BodyType = {
  previousMessages?: Doc<"message">[];
  message: Id<"message">;
};
http.route({
  path: "/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { message, previousMessages } = (await request.json()) as BodyType;
    const apiKey = request.headers.get("X-Botforge-Api-Key");

    if (!message || !apiKey) {
      return new Response("Invalid Request!", {
        status: 300,
      });
    }

    const bot = (await ctx.runQuery(api.bots.getBotByApiKey, {
      apiKey,
    })) as Doc<"bot">;

    const pineconeIndex = await getPineconeIndex();
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const embedding = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embedding, {
      pineconeIndex,
      namespace: bot._id,
    });

    const context = await vectorStore.similaritySearch(message, 4);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
                
          \n----------------\n
          
          PREVIOUS CONVERSATION:
          ${previousMessages?.map((message) => {
            if (message.author === "user") return `User: ${message.text}\n`;
            return `Assistant: ${message.text}\n`;
          })}
          
          \n----------------\n
          
          CONTEXT:
          ${context?.map((r: any) => r.pageContent).join("\n\n")}
          
          USER INPUT: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  }),
});

export default http;
