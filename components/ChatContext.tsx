import { Id } from "@/convex/_generated/dataModel";
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
  // const { toast } = useToast();

  // const { mutate: sendMessage } = useMutation({
  //   mutationFn: async ({ message }: { message: string }) => {
  //     const response = await fetch("/api/message", {
  //       method: "POST",
  //       body: JSON.stringify({ botId, message }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to send message");
  //     }

  //     return response.body;
  //   },
  // });

  function addMessage() {
    // sendMessage({ message });
  }

  function handleInputChange(data: any) {
    // setMessage(data);
    console.log(data);
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
