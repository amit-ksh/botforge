"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileWarningIcon,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleBar from "simplebar-react";

import PdfFullScreen from "./PdfFullScreen";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url?: string | null | undefined;
}

function PdfRenderer({ url }: PdfRendererProps) {
  const { width, ref } = useResizeDetector();

  const [numPages, setNumPages] = useState<number>();
  const [curPage, setCurPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  function handlePageSumit({ page }: TCustomPageValidator) {
    setCurPage(Number(page));
    setValue("page", String(page));
  }

  if (!url)
    return (
      <div className="w-full h-[80vh] text-xl flex items-center justify-center">
        <FileWarningIcon className="w-8 h-8 text-red-600 mr-4" /> Error! File
        not found.
      </div>
    );

  return (
    <div className="w-full rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-300 dark:border-zinc-800 flex items-center justify-between px-2">
        {/* PAGE NEXT & PREV */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            aria-label="previous page"
            disabled={!numPages || curPage <= 1}
            onClick={() => {
              setCurPage((prevPage) => (prevPage - 1 > 1 ? prevPage - 1 : 1));
              setValue("page", String(curPage - 1));
            }}
            className="min-w-[auto]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="h-full flex items-center gap-1.5">
            <Input
              {...register("page")}
              type="number"
              variant="faded"
              max={numPages}
              min={1}
              className={`
                w-12
                ${errors.page && "focus-visible:ring-red-500"}
              `}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSumit)();
                }
              }}
            />
            <p className="space-x-1">
              <span className="">/</span>
              <span className="">{numPages ?? "x"}</span>
            </p>
          </div>

          <Button
            variant="ghost"
            aria-label="next page"
            disabled={!numPages || curPage >= numPages}
            onClick={() => {
              setCurPage((prevPage) =>
                prevPage + 1 < numPages! ? prevPage + 1 : numPages!
              );
              setValue("page", String(curPage + 1));
            }}
            className="min-w-[auto]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* SCALE DROPDOWN */}
        <Dropdown className="space-x-2">
          <DropdownTrigger>
            <Button aria-label="zoom" variant="ghost" className="gap-1.5">
              <Search className="h-4 w-4" />
              {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            defaultSelectedKeys={`${scale}`}
            aria-label="select scale value"
            selectionMode="single"
            selectedKeys={`${scale}`}
            // @ts-ignore
            onSelectionChange={(d) => setScale(+d?.currentKey!)}
          >
            <DropdownSection title="Scale">
              <DropdownItem key={1}>100%</DropdownItem>
              <DropdownItem key={1.5}>150%</DropdownItem>
              <DropdownItem key={2}>200%</DropdownItem>
              <DropdownItem key={2.5}>250%</DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() =>
              setRotation((prev) => (prev !== 270 ? prev + 90 : 0))
            }
            aria-label="rotate 90 degree"
            className="min-w-[auto]"
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          <PdfFullScreen fileUrl={url} />
        </div>
      </div>

      {/* PDF VIEWER */}
      <div className="flex-1 w-full overflow-y-hidden">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-9.4rem)]">
          <div ref={ref} className="max-h-[calc(100vh-9.4rem)]">
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
              file={url}
            >
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={curPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                key={"@" + scale}
                width={width ? width : 1}
                pageNumber={curPage}
                scale={scale}
                rotate={rotation}
                className={`{${isLoading ? "hidden" : ""}`}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 w-6 h-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

export default PdfRenderer;
