"use client";
import { notFound } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { Tabs, Tab, Snippet } from "@nextui-org/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import ChatWrapper from "@/components/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { format } from "date-fns";
import DeleteButton from "@/components/DeleteButton";

interface PageProps {
  params: {
    botId: Id<"bot">;
  };
}

function Page({ params }: PageProps) {
  const { botId } = params;
  const { userId } = useAuth();

  const bot = useQuery(api.bots.getBotById, { id: botId, userId: userId! });
  const fileUrl = useQuery(api.bots.getBotContentFile, {
    fileId: bot ? bot.content : undefined,
  });

  if (!bot)
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <Loader2Icon className="w-20 h-20 animate-spin text-orange-600" />
      </div>
    );

  if (!bot?._id) notFound();

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col mt-4 px-6">
      <Tabs aria-label="Options" fullWidth={true}>
        <Tab key="chat" title="Chat">
          <div className="mx-auto w-full h-[91vh] max-w-7xl grow lg:flex xl:px-2">
            {/* left side */}
            <div className="flex-1 xl:flex">
              <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                <PdfRenderer url={fileUrl} />
              </div>
            </div>

            {/* right side */}
            <div className="shrink-0 min-h-[50vh] flex-[0.75] border-t border-zinc-300 dark:border-zinc-800 lg:w-96 lg:border-l lg:border-t-0">
              <ChatWrapper botStatus={bot.status} botId={bot._id} />
            </div>
          </div>
        </Tab>
        <Tab key="setting" title="Settings">
          <h2 className="text-3xl font-bold text-center my-8">Settings</h2>

          <div className="max-w-7xl font-semibold">
            <ul className="flex flex-col gap-6">
              <li className="flex flex-col gap-2">
                <h3 className="text-xl">API Key</h3>
                <Snippet symbol="">{bot.apiKey}</Snippet>
              </li>
              <li className="flex flex-col gap-2">
                <h3 className="text-xl">Bot Name</h3>
                <Snippet symbol="" hideCopyButton className="py-2">
                  {bot.name}
                </Snippet>
              </li>
              <li className="flex flex-col gap-2">
                <h3 className="text-xl">Bot Description</h3>
                <Snippet symbol="" hideCopyButton className="py-2">
                  {bot.description}
                </Snippet>
              </li>
              <li className="flex flex-col gap-2">
                <h3 className="text-xl">Created Date</h3>
                <Snippet symbol="" hideCopyButton className="py-2">
                  {format(bot._creationTime, "d MMMM y")}
                </Snippet>
              </li>
              <li className="flex flex-col gap-2">
                <h3 className="text-xl">Bot Status</h3>
                <Snippet symbol="" hideCopyButton className="py-2">
                  {bot.status}
                </Snippet>
              </li>
            </ul>
          </div>

          <div className="w-full flex justify-end">
            <DeleteButton
              variant="ghost"
              className="my-4 text-lg font-semibold"
              botId={bot._id}
              userId={userId!}
            >
              Delete Bot
            </DeleteButton>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Page;
