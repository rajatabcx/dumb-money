"use client";

import { downloadFileAction } from "@/actions/downloadFile";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Download, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useCopyToClipboard } from "usehooks-ts";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

type Props = {
  token: string;
  invoiceNumber: string;
  storageId?: Id<"_storage">;
};

export default function InvoiceToolbar({ storageId }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [, copy] = useCopyToClipboard();

  const handleCopyLink = () => {
    const url = window.location.href;
    copy(url);
  };

  const downloadFile = async () => {
    console.log("downloading file", { storageId });
    if (!storageId) {
      return;
    }

    setIsDownloading(true);
    const url = await downloadFileAction(storageId);
    if (url) {
      window.open(url, "_blank");
    }
    setIsDownloading(false);
  };

  return (
    <motion.div
      className="fixed inset-x-0 -bottom-1 flex justify-center"
      initial={{ opacity: 0, filter: "blur(8px)", y: 0 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: -24 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="backdrop-filter backdrop-blur-lg dark:bg-[#1A1A1A]/80 bg-[#F6F6F3]/80 rounded-full pl-2 pr-4 py-3 h-10 flex items-center justify-center border-[0.5px] border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-8 cursor-pointer"
              onClick={downloadFile}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={15}
            className="text-[10px] px-2 py-1 rounded-sm font-medium"
          >
            <p>Download</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-8 cursor-pointer"
              onClick={handleCopyLink}
            >
              <Copy className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={15}
            className="text-[10px] px-2 py-1 rounded-sm font-medium"
          >
            <p>Copy link</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
