"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

import { FormEvent, useState } from "react";
import Dropzone from "react-dropzone";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Progress,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import {
  CheckCircle2Icon,
  CloudIcon,
  File,
  UploadCloudIcon,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { redirect } from "next/navigation";

function UploadButton() {
  const generateUploadUrl = useMutation(api.bots.generateUploadUrl);
  const createBot = useMutation(api.bots.createBot);
  const { userId } = useAuth();

  const [botName, setBotName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  if (!userId) return redirect("/");

  const createBotFormID = "create-bot-form";

  function uploadFile(file: any) {
    setFile(file);
  }

  async function handleCreateBot(e: FormEvent) {
    e.preventDefault();

    console.log("CREATE BOT");

    if (!userId) return redirect("/");
    if (!botName || !description || !file) return;

    setLoading(true);
    // Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    //  POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file!.type },
      body: file,
    });
    const { storageId } = await result.json();
    // Save the bot to the database
    const botId = await createBot({
      file: storageId,
      name: botName,
      description,
      userId,
    });

    setLoading(false);
    if (!botId) {
      // create an error toast
    } else {
      // create a success toast
      onClose();
    }
  }

  return (
    <>
      <Button className="bg-orange-600" onPress={onOpen}>
        <UploadCloudIcon className="w-6 h-6 text-white" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="p-6">
          <ModalHeader>
            <h2 className="text-orange-600 text-large font-semibold">
              Create a bot
            </h2>
          </ModalHeader>
          <ModalBody>
            <form
              id={createBotFormID}
              className="space-y-3"
              onSubmit={handleCreateBot}
            >
              <div className="">
                <Input
                  type="text"
                  label="Bot Name"
                  variant="bordered"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  label="Short Description"
                  variant="bordered"
                  maxLength={128}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Content</label>
                <UploadDropzone onFileUpload={uploadFile} />
              </div>

              <Button
                form={createBotFormID}
                type="submit"
                isLoading={loading}
                variant="solid"
                className="w-full font-semibold tracking-wide bg-orange-600 uppercase"
              >
                Create
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UploadButton;

interface UploadDropzoneProps {
  onFileUpload: (arg: any) => void;
}

const UploadDropzone = ({ onFileUpload }: UploadDropzoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      maxFiles={1}
      accept={{
        "application/pdf": [],
      }}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        onFileUpload(acceptedFiles[0]);

        clearInterval(progressInterval);
        setUploadProgress(100);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 w-full border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex item-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
                <CloudIcon className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden  outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-black text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full"
                    aria-label="Uploading..."
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <span>
                        <CheckCircle2Icon
                          className="w-6 h-6 text-green-500"
                          aria-hidden
                        />
                      </span>
                      <span>Uploaded</span>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
