import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Doc } from "@/convex/_generated/dataModel";
import { AppLogo } from "./icons";

interface MessageProps {
  ref: (node?: Element | null | undefined) => void;
  message: Doc<"message">;
  isNextMessageSamePerson: boolean;
}

function Message({ message, isNextMessageSamePerson, ref }: MessageProps) {
  const isUserMessage = message.author === "user";

  return (
    <div
      ref={ref}
      className={cn(`flex items-end`, {
        "justify-end": isUserMessage,
      })}
    >
      <div
        className={cn(
          "relative flex h-8 w-8 aspect-square items-center justify-center",
          {
            "order-2 bg-blue-600 rounded-full": isUserMessage,
            "order-1 bg-orange-600 rounded-full": !isUserMessage,
            invisible: isNextMessageSamePerson,
          }
        )}
      >
        {isUserMessage ? (
          <User className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
        ) : (
          <AppLogo className="text-zinc-200 h-3/4 w-3/4" />
        )}
      </div>

      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": isUserMessage,
          "order-2 items-start": !isUserMessage,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg inline-block", {
            "bg-blue-600 text-white": isUserMessage,
            "bg-gray-200 text-gray-900": !isUserMessage,
            "rounded-br-none": !isNextMessageSamePerson && isUserMessage,
            "rounded-bl-none": !isNextMessageSamePerson && !isUserMessage,
          })}
        >
          {typeof message.text === "string" ? (
            <ReactMarkdown
              className={cn("prose", {
                "text-zinc-50": isUserMessage,
              })}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
          {message._id !== "loading-message" ? (
            <div
              className={cn("text-xs select-none mt-2 w-full text-right", {
                "text-zinc-500": !isUserMessage,
                "text-blue-300": isUserMessage,
              })}
            >
              {format(new Date(message._creationTime), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Message;
