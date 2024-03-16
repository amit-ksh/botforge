import React, { useContext, useRef } from "react";
import { Send } from "lucide-react";
import { ChatContext } from "./ChatContext";
import { Button, Textarea } from "@nextui-org/react";

interface ChatInputProps {
  isDisabled?: boolean;
}

function ChatInput({ isDisabled }: ChatInputProps) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="lg:absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                rows={1}
                maxRows={4}
                placeholder="Enter your question..."
                // className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                autoFocus
                // disabled={isDisabled}
                // onChange={handleInputChange}
                // value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    addMessage();

                    textareaRef.current?.focus();
                  }
                }}
              />

              <Button
                type="submit"
                className="absolute bottom-[18px] right-[8px] bg-orange-600 "
                disabled={isLoading || isDisabled}
                aria-label="send message"
                isDisabled={!textareaRef?.current?.value}
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
