import { CircleCheckBigIcon, Loader, MessageSquare } from "lucide-react";
import React from "react";
import Message from "./Message";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@nextui-org/react";

interface MessagesProps {
  botId: Id<"bot">;
}

function Messages({ botId }: MessagesProps) {
  const messages = usePaginatedQuery(
    api.messages.getMessagesOfBots,
    { botId },
    { initialNumItems: 10 }
  );

  const loadingMessages = {
    _creationTime: new Date().toISOString(),
    _id: "loading-messages",
    messageBy: "assistant",
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader className="w-4 h-4 animate-spin" />
      </span>
    ),
  } as unknown as Doc<"message">;

  const combinedMessages = [
    ...(messages.isLoading ? [loadingMessages] : []),
    ...(messages.results ?? []),
  ];

  console.log(combinedMessages);

  return (
    <div
      style={{ maxHeight: "calc(100vh - 1rem)" }}
      className="flex max-h-[calc(100vh - 1rem)] h-full border-zinc-700 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue scrollbar-w-2 scrolling-touch"
    >
      {/* MESSAGES */}
      {combinedMessages && combinedMessages.length > 0
        ? combinedMessages.map((msg, idx) => {
            const isNextMessageSamePerson =
              combinedMessages[idx - 1]?.author ===
              combinedMessages[idx]?.author;

            if (idx === messages.results.length - 1) {
              return (
                <Message
                  key={msg._id}
                  message={msg}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                />
              );
            }

            return (
              <Message
                key={msg._id}
                message={msg}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          })
        : null}

      {/* ALL MESSAGES FETECHED */}
      {messages.results.length > 0 && messages.status === "Exhausted" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <CircleCheckBigIcon className="h-8 w-8 text-orange-600" />
          <h3 className="font-semibold text-xl">No messages left to show.</h3>
        </div>
      ) : null}

      {/* FIRST MESSAGE PROMPT */}
      {messages.results.length <= 0 && messages.status === "Exhausted" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-orange-600" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-sm text-default-foreground font-thin">
            Ask your first question to get started.
          </p>
        </div>
      ) : null}

      {/* LOADING */}
      {messages.isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-8 rounded-lg" />
          <Skeleton className="h-8 rounded-lg" />
          <Skeleton className="h-8 rounded-lg" />
        </div>
      ) : null}
    </div>
  );
}

export default Messages;
