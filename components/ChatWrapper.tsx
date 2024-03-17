"use client";

import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import ChatContextProvider from "./ChatContext";
import { Link, Button } from "@nextui-org/react";
import { Id } from "@/convex/_generated/dataModel";

interface ChatWrapperProps {
  botStatus: "PROCESSING" | "FAILED" | "READY";
  botId: Id<"bot">;
}

function ChatWrapper({ botId, botStatus }: ChatWrapperProps) {
  if (botStatus === "PROCESSING") {
    return (
      <div className="relative min-h-[50vh] h-full divide-y divide-zinc-300 dark:divide-zinc-800 flex-col justify-between gap-2">
        <div className="h-full flex-1 flex flex-col justify-between items-center">
          <div className="mt-8 flex flex-col items-center gap-2 my-auto">
            <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
            <h3 className="font-semibold text-xl ">Processing PDF...</h3>
            <p className="text-sm">This won&apos;t take long.</p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  if (botStatus === "FAILED") {
    return (
      <div className="relative min-h-full divide-y divide-zinc-300 dark:divide-zinc-800 flex-col justify-between gap-2">
        <div className="flex-1 flex flex-col justify-between items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="font-semibold text-xl ">Too many pages in PDF...</h3>
            <p className="text-zinc-500 text-sm">
              Your <span className="font-medium">Free</span> plan up to 5 pages
              per PDF.
            </p>
            <Button as={Link} href="/dashboard">
              <ChevronLeft className="h-3 w-3 mr-1.5" /> Back
            </Button>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  // BOT 'READY' STATE
  return (
    <ChatContextProvider botId={botId}>
      <div className="relative max-h-screen divide-y divide-zinc-300 dark:divide-zinc-800 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col">
          <Messages botId={botId} />
        </div>
        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}

export default ChatWrapper;
