"use client";

import { downloadFileAction } from "@/actions/downloadFile";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Download } from "lucide-react";
import { motion } from "motion/react";
import { useCopyToClipboard } from "usehooks-ts";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  token: string;
  invoiceNumber: string;
  storageId?: Id<"_storage">;
};

export default function InvoiceToolbar({
  token,
  invoiceNumber,
  storageId,
}: Props) {
  const [, copy] = useCopyToClipboard();

  const handleCopyLink = () => {
    const url = window.location.href;
    copy(url);
  };

  const handleDownload = async (storageId?: Id<"_storage">) => {
    if (!storageId) return;
    const url = await downloadFileAction(storageId);
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <motion.div
      className="fixed inset-x-0 -bottom-1 flex justify-center"
      initial={{ opacity: 0, filter: "blur(8px)", y: 0 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: -24 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="backdrop-filter backdrop-blur-lg dark:bg-[#1A1A1A]/80 bg-[#F6F6F3]/80 rounded-full pl-2 pr-4 py-3 h-10 flex items-center justify-center border-[0.5px] border-border">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-8"
                onClick={() => {
                  handleDownload(storageId);
                }}
              >
                <Download className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={15}
              className="text-[10px] px-2 py-1 rounded-sm font-medium"
            >
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-8"
                onClick={handleCopyLink}
              >
                <Copy className="size-[18px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={15}
              className="text-[10px] px-2 py-1 rounded-sm font-medium"
            >
              <p>Copy link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
