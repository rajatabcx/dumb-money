"use client";

import { OpenURL } from "@/components/common/OpenUrl";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { downloadFileAction } from "@/actions/downloadFile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "usehooks-ts";
import type { Invoice } from "./Columns";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { sendInvoicePaidEmail } from "@/actions/sendInvoicePaid";
import { useState } from "react";

type Props = {
  row: Invoice;
  companyId: Id<"company">;
};

export function ActionsMenu({ row, companyId }: Props) {
  const [isSendingPaid, setIsSendingPaid] = useState(false);
  const { setParams } = useInvoiceParams();
  const [, copy] = useCopyToClipboard();

  const deleteInvoiceMutation = useApiMutation(api.invoices.deleteInvoice);

  const updateInvoiceMutation = useApiMutation(api.invoices.updateInvoice);
  const markAsUnpaidMutation = useApiMutation(api.invoices.markAsUnpaid);

  const handleCopyLink = async () => {
    copy(`${process.env.NEXT_PUBLIC_BASE_URL}/i/${row.token}`);

    toast.success("Copied link to clipboard.");
  };

  const handleDownload = async () => {
    const url = await downloadFileAction(row.storageId);
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleMarkAsPaid = (date: Date | undefined) => {
    setIsSendingPaid(true);
    if (date) {
      updateInvoiceMutation.mutate({
        id: row.id,
        status: "paid",
        paidAt: date.toISOString(),
      });
    } else {
      // NOTE: Today is undefined
      updateInvoiceMutation.mutate({
        id: row.id,
        status: "paid",
        paidAt: new Date().toISOString(),
      });
    }
    sendInvoicePaidEmail(row.id);
    setIsSendingPaid(false);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {row.status !== "paid" && row.status !== "canceled" && (
            <DropdownMenuItem
              onClick={() =>
                setParams({
                  invoiceId: row.id,
                  type: "edit",
                })
              }
              className="cursor-pointer"
            >
              Edit invoice
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="cursor-pointer">
            <OpenURL
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${row.token}`}
            >
              Open invoice
            </OpenURL>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
            Copy link
          </DropdownMenuItem>

          {row.status !== "draft" && (
            <DropdownMenuItem
              onClick={handleDownload}
              className="cursor-pointer"
            >
              Download
            </DropdownMenuItem>
          )}

          {/* <DropdownMenuItem
            onClick={() => duplicateInvoiceMutation.mutate({ id: row.id })}
          >
            Duplicate
          </DropdownMenuItem> */}

          {row.status === "paid" && (
            <DropdownMenuItem
              onClick={() =>
                markAsUnpaidMutation.mutate({
                  id: row.id,
                })
              }
            >
              Mark as unpaid
            </DropdownMenuItem>
          )}

          {(row.status === "overdue" || row.status === "unpaid") && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="cursor-pointer"
                  disabled={isSendingPaid}
                >
                  Mark as paid
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <Calendar
                    mode="single"
                    toDate={new Date()}
                    selected={new Date()}
                    onSelect={(date) => {
                      handleMarkAsPaid(date);
                    }}
                    initialFocus
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onClick={() =>
                  updateInvoiceMutation.mutate({
                    id: row.id,
                    status: "canceled",
                  })
                }
                className="text-destructive cursor-pointer"
              >
                Cancel
              </DropdownMenuItem>
            </>
          )}

          {row.status === "canceled" && (
            <DropdownMenuItem
              onClick={() =>
                deleteInvoiceMutation.mutate({
                  id: row.id,
                  companyId: row.companyId,
                })
              }
              className="text-destructive cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}

          {row.status === "draft" && (
            <DropdownMenuItem
              onClick={() =>
                deleteInvoiceMutation.mutate({
                  id: row.id,
                  companyId: row.companyId,
                })
              }
              className="text-destructive cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
