"use client";

import { GhostIcon, LinkIcon, PlusIcon, TrashIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";

import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Image,
  Button,
} from "@nextui-org/react";
import { title } from "./primitives";
import UploadButton from "./UploadButton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

function Dashboard() {
  const { userId } = useAuth();

  const bots = useQuery(api.bots.getUserBots, { userId: userId! });

  return (
    <main className="mx-auto max-w-7xl px-6 md:px-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className={title({ size: "sm" })}>My Bots</h1>
        <UploadButton />
      </div>

      {bots && bots?.length > 0 ? (
        <ul className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {bots
            .sort(
              (a, b) =>
                new Date(b._creationTime).getTime() -
                new Date(a._creationTime).getTime()
            )
            .map((bot, idx) => (
              <li key={bot._id} className="col-span-1">
                <Card
                  as={Link}
                  href={`/bot/${bot._id}`}
                  className="sm:max-w-[360px]"
                  shadow="md"
                  isHoverable
                >
                  <CardHeader className=" justify-between">
                    <div className="flex gap-3">
                      <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                        width={40}
                      />
                      <div className="flex flex-col">
                        <p className="text-lg">{bot.name}</p>
                        <p className="text-small text-default-500">
                          {bot.description}
                        </p>
                      </div>
                    </div>

                    <div className="self-start ">
                      <LinkIcon className="text-orange-500 w-5 h-5" />
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="flex justify-between">
                      <p className="flex items-center gap-3 text-sm">
                        <span className="">
                          <PlusIcon className="w-4 h-4" />
                        </span>
                        <span className="">
                          {format(bot._creationTime, "MMM y")}
                        </span>
                      </p>

                      <Button
                        color="danger"
                        variant="ghost"
                        className="w-4 h-7"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
        </ul>
      ) : true ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <GhostIcon className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here.</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
