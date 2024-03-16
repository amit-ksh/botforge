import { OpenAI } from "openai";
import { internalAction } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

type ChatParams = {
  messages: Doc<"message">[];
  messageId: Id<"message">;
  message: string;
  context?: any;
};

export const chat = internalAction({
  handler: async (ctx, { data }: { data: string }) => {
    const { message, messageId, messages, context } = JSON.parse(
      data
    ) as ChatParams;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    try {
      const stream = await openai.chat.completions.create({
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
        ${messages.map((message) => {
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

      let text = "";
      for await (const part of stream) {
        if (part.choices[0].delta?.content) {
          text += part.choices[0].delta.content;
          await ctx.runMutation(internal.messages.update, {
            messageId,
            text,
          });
        }
      }
    } catch (e) {
      if (e instanceof OpenAI.APIError) {
        console.error(e.status);
        console.error(e.message);
        await ctx.runMutation(internal.messages.update, {
          messageId,
          text: "OpenAI call failed: " + e.message,
        });
        console.error(e);
      } else {
        throw e;
      }
    }
  },
});
