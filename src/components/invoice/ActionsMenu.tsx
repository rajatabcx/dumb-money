"use client";

import { OpenURL } from "@/components/common/OpenUrl";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { downloadFile } from "@/lib/invoice/downloadFile";
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

type Props = {
  row: Invoice;
};

export function ActionsMenu({ row }: Props) {
  const { setParams } = useInvoiceParams();
  const [, copy] = useCopyToClipboard();

  const deleteInvoiceMutation = useMutation(
    trpc.invoice.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.infiniteQueryKey(),
        });

        // Widget uses regular query
        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.getById.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.invoiceSummary.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.defaultSettings.queryKey(),
        });
      },
    })
  );

  const updateInvoiceMutation = useMutation(
    trpc.invoice.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.infiniteQueryKey(),
        });

        // Widget uses regular query
        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.queryKey(),
        });
      },
    })
  );

  const duplicateInvoiceMutation = useMutation(
    trpc.invoice.duplicate.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          setParams({
            invoiceId: data.id,
            type: "edit",
          });
        }

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.infiniteQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.queryKey(),
        });
      },
    })
  );

  const handleCopyLink = async () => {
    copy(`${process.env.NEXT_PUBLIC_BASE_URL}/i/${row.token}`);

    toast.success("Copied link to clipboard.");
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
            <DropdownMenuItem
              onClick={() => {
                downloadFile(
                  `/api/download/invoice?id=${row.id}`,
                  `${row.invoiceNumber || "invoice"}.pdf`
                );
              }}
            >
              Download
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => duplicateInvoiceMutation.mutate({ id: row.id })}
          >
            Duplicate
          </DropdownMenuItem>

          {row.status === "paid" && (
            <DropdownMenuItem
              onClick={() =>
                updateInvoiceMutation.mutate({
                  id: row.id,
                  status: "unpaid",
                  paidAt: null,
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
                className="text-[#FF3638]"
              >
                Cancel
              </DropdownMenuItem>
            </>
          )}

          {row.status === "canceled" && (
            <DropdownMenuItem
              onClick={() => deleteInvoiceMutation.mutate({ id: row.id })}
              className="text-[#FF3638]"
            >
              Delete
            </DropdownMenuItem>
          )}

          {row.status === "draft" && (
            <DropdownMenuItem
              onClick={() => deleteInvoiceMutation.mutate({ id: row.id })}
              className="text-[#FF3638]"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
