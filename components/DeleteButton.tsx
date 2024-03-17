import { ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ButtonProps,
} from "@nextui-org/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface DeleteButtonProps extends ButtonProps {
  children: ReactNode;
  botId: Id<"bot">;
  userId: string;
}

function DeleteButton({
  children,
  botId,
  userId,
  ...props
}: DeleteButtonProps) {
  const deleteBot = useMutation(api.bots.deleteBot);

  const route = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  async function handleBotDelete() {
    setLoading(true);
    const resp = await deleteBot({ userId, id: botId });

    if (resp.code == 200) {
      // success toast
      setLoading(false);
      onClose();
      if (route !== "/dashboard") return router.push("/dashboard");
    } else {
      // failure toast
    }
  }

  return (
    <>
      <Button color="danger" variant="ghost" onPress={onOpen} {...props}>
        {children ?? "Delete"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Bot
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want delete this bot? Deleted bot cannot be
                  recovered.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="bordered"
                  onPress={onClose}
                  isDisabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleBotDelete}
                  isDisabled={loading}
                >
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteButton;
