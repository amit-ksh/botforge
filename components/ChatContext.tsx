import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ChangeEventHandler, ReactNode, createContext, useState } from "react";

export type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: any) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface ChatContextProviderProps {
  botId: Id<"bot">;
  children: ReactNode;
}

function ChatContextProvider({ botId, children }: ChatContextProviderProps) {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = useMutation(api.messages.send);

  async function addMessage() {
    await sendMessage({ message, botId });
  }

  function handleInputChange(data: string) {
    setMessage(data);
  }

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatContextProvider;
