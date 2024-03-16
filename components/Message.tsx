import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Logo } from "./icons";

interface MessageProps {
  message: Doc<"message">;
  isNextMessageSamePerson: boolean;
}

function Message({ message, isNextMessageSamePerson }: MessageProps) {
  const isUserMessage = message.author === "user";

  return (
    <div
      className={cn(`flex items-end`, {
        "justify-end": isUserMessage,
      })}
    >
      <div
        className={cn(
          "relative flex h-6 w-6 aspect-square items-center justify-center",
          {
            "order-2 bg-blue-600 rounded-sm": isUserMessage,
            "order-1 bg-zinc-600 rounded-sm": !isUserMessage,
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {isUserMessage ? (
          <User className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
        ) : (
          <Logo className="fill-zinc-300 h-3/4 w-3/4" />
        )}
      </div>
    </div>
  );
}

export default Message;
