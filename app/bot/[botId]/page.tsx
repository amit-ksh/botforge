"use client";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import ChatWrapper from "@/components/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";

interface PageProps {
  params: {
    botId: Id<"bot">;
  };
}

function Page({ params }: PageProps) {
  const { botId } = params;
  const { userId } = useAuth();

  const bots = useQuery(api.bots.getBotById, { id: botId, userId: userId! });
  const fileUrl = useQuery(api.bots.getBotContentFile, {
    fileId: bots && bots.length > 0 ? bots![0].content : undefined,
  });

  if (!bots)
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <Loader2Icon className="w-20 h-20 animate-spin text-orange-600" />
      </div>
    );

  const bot = bots[0];

  if (!bot?._id) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)] overflow-y-hidden">
      <div className="mx-auto w-full h-[91vh] max-w-7xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer url={fileUrl} />
          </div>
        </div>

        {/* right side */}
        <div className="shrink-0 flex-[0.75] border-t border-zinc-700 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper botStatus={bot.status} botId={bot._id} />
        </div>
      </div>
    </div>
  );
}

export default Page;