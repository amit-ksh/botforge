import { useState } from "react";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";

interface PdfFullScreenProps {
  fileUrl: string;
}

function PdfFullScreen({ fileUrl }: PdfFullScreenProps) {
  const { width, ref } = useResizeDetector();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  const [numPages, setNumPages] = useState<number>();

  return (
    <>
      <Button
        variant="ghost"
        className="gap-1.5"
        aria-label="fullscreen"
        onClick={onOpen}
      >
        <Expand className="w-4 h-4" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-7xl w-full">
          <ModalBody>
            <SimpleBar
              autoHide={false}
              className="max-h-[calc(100vh-10rem)] mt-6"
            >
              <div ref={ref} className="max-h-[calc(100vh-10rem)]">
                <Document
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onLoadError={() => {
                    // PDF loading error toast
                  }}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  file={fileUrl}
                  className="max-h-full"
                >
                  {new Array(numPages).fill(0).map((_, idx) => (
                    <Page
                      key={idx}
                      width={width ? width : 1}
                      pageNumber={idx + 1}
                    />
                  ))}
                </Document>
              </div>
            </SimpleBar>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PdfFullScreen;
