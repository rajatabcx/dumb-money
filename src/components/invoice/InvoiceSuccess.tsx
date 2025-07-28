"use client";

import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion } from "motion/react";
import { InvoiceSheetHeader } from "./InvoiceSheetHeader";
import { FormatAmount } from "../common/FormatAmount";
import { CopyInput } from "../ui/copy-input";
import { Download } from "lucide-react";
import { OpenURL } from "../common/OpenUrl";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { downloadFileAction } from "@/actions/downloadFile";
import { Id } from "../../../convex/_generated/dataModel";

export function InvoiceSuccess() {
  const { invoiceId, setParams } = useInvoiceParams();

  const invoice = useQuery(
    api.invoices.getInvoice,
    invoiceId ? { id: invoiceId } : "skip"
  );

  const handleDownload = async (storageId?: Id<"_storage">) => {
    const url = await downloadFileAction(storageId);
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (!invoice) {
    return null;
  }

  return (
    <>
      <InvoiceSheetHeader
        type={
          invoice?.template?.deliveryType === "create_and_send"
            ? "created_and_sent"
            : "created"
        }
      />

      <div className="flex flex-col justify-center h-[calc(100vh-260px)]">
        <div className="bg-[#F2F2F2] dark:bg-background p-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex space-x-1 items-center">
              <div className="flex items-center">
                <span className="text-[11px] text-[#878787] font-mono">
                  {invoice.template.invoiceNoLabel}
                </span>
                <span className="text-[11px] text-[#878787] font-mono">:</span>
              </div>

              <span className="font-mono text-[11px]">
                {invoice.invoiceNumber}
              </span>
            </div>

            <div className="flex space-x-1 items-center">
              <div className="flex items-center">
                <span className="text-[11px] text-[#878787] font-mono">
                  {invoice.template.dueDateLabel}
                </span>
                <span className="text-[11px] text-[#878787] font-mono">:</span>
              </div>

              <span className="font-mono text-[11px]">
                {format(
                  new Date(invoice.dueDate!),
                  invoice.template.dateFormat
                )}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <span className="text-[11px] font-mono">
              {invoice.template.customerLabel}
            </span>
            <div className="font-mono text-[#878787]">
              {/* @ts-expect-error - customerDetails is JSONB */}
              {formatEditorContent(invoice.customerDetails)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-center justify-between mt-10 border-b border-border border-dashed pb-4"
          >
            <span className="text-[11px] text-[#878787] font-mono">
              {invoice.template.totalSummaryLabel}
            </span>

            <span className="font-mono text-xl">
              {invoice.amount && invoice.currency && (
                <FormatAmount
                  amount={invoice.amount}
                  currency={invoice.currency}
                />
              )}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-col space-y-6 mt-10 mb-6"
          >
            <h2>Details</h2>

            {invoice.sentTo && (
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] text-[#878787] font-mono">
                  Invoice sent to
                </span>
                <span className="text-sm">{invoice.sentTo}</span>
              </div>
            )}

            <div>
              <span className="text-[11px] text-[#878787] font-mono">
                Share link
              </span>
              <div className="flex w-full gap-2 mt-1">
                <div className="flex-1 min-w-0">
                  <CopyInput
                    value={`${process.env.NEXT_PUBLIC_APP_URL}/i/${invoice.token}`}
                  />
                </div>

                <Button
                  variant="secondary"
                  className="size-[40px] hover:bg-secondary shrink-0"
                  onClick={() => handleDownload(invoice.storageId)}
                >
                  <div>
                    <Download className="size-4" />
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-wrap gap-3 absolute -bottom-[15px] left-0 right-0 w-full justify-center"
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index.toString()}
                className="size-[30px] rounded-full bg-background dark:bg-[#0C0C0C]"
              />
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex mt-auto absolute bottom-6 justify-end gap-4 right-6 left-6">
        <OpenURL href={`${process.env.NEXT_PUBLIC_APP_URL}/i/${invoice.token}`}>
          <Button variant="secondary">View invoice</Button>
        </OpenURL>

        <Button
          onClick={() => {
            setParams(null);

            setTimeout(() => {
              setParams({ type: "create" });
            }, 600);
          }}
        >
          Create another
        </Button>
      </div>
    </>
  );
}
