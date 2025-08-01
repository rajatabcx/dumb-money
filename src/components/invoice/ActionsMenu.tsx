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

type Props = {
  row: Invoice;
  companyId: Id<"company">;
};

export function ActionsMenu({ row, companyId }: Props) {
  const { setParams } = useInvoiceParams();
  const [, copy] = useCopyToClipboard();

  const deleteInvoiceMutation = useApiMutation(api.invoices.deleteInvoice);

  const updateInvoiceMutation = useApiMutation(api.invoices.updateInvoice);

  //   trpc.invoice.duplicate.mutationOptions({
  //     onSuccess: (data) => {
  //       if (data) {
  //         setParams({
  //           invoiceId: data.id,
  //           type: "edit",
  //         });
  //       }

  //       queryClient.invalidateQueries({
  //         queryKey: trpc.invoice.get.infiniteQueryKey(),
  //       });

  //       queryClient.invalidateQueries({
  //         queryKey: trpc.invoice.get.queryKey(),
  //       });
  //     },
  //   })
  // );

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

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="relative">
          <Button variant="ghost" className="h-8 w-8 p-0">
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
            >
              Edit invoice
            </DropdownMenuItem>
          )}

          <DropdownMenuItem>
            <OpenURL
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${row.token}`}
            >
              Open invoice
            </OpenURL>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyLink}>
            Copy link
          </DropdownMenuItem>

          {row.status !== "draft" && (
            <DropdownMenuItem onClick={handleDownload}>
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
                updateInvoiceMutation.mutate({
                  id: row.id,
                  status: "unpaid",
                  paidAt: undefined,
                })
              }
            >
              Mark as unpaid
            </DropdownMenuItem>
          )}

          {(row.status === "overdue" || row.status === "unpaid") && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Mark as paid</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <Calendar
                    mode="single"
                    toDate={new Date()}
                    selected={new Date()}
                    onSelect={(date) => {
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
                className="text-destructive"
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
              className="text-destructive"
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
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
