"use client";

import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FormatAmount } from "@/components/common/FormatAmount";
import { InvoiceActions } from "./InvoiceActions";
import { InvoiceDetailsSkeleton } from "./InvoiceDetailsSkeleton";
import { InvoiceNote } from "./InvoiceNote";
import { InvoiceStatus } from "./InvoiceStatus";
import { InvoiceActivity } from "@/components/invoice/InvoiceActivity";
import { OpenURL } from "@/components/common/OpenUrl";
import { CopyInput } from "@/components/ui/copy-input";
import { ArrowDown, ExternalLink } from "lucide-react";
import { getWebsiteLogo } from "@/lib/invoice/logo";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { downloadFileAction } from "@/actions/downloadFile";
import { Id } from "../../../convex/_generated/dataModel";

export function InvoiceDetails({ companyId }: { companyId: Id<"company"> }) {
  const { invoiceId } = useInvoiceParams();

  const isOpen = invoiceId !== null;

  const data = useQuery(
    api.invoices.getInvoice,
    isOpen
      ? {
          id: invoiceId,
        }
      : "skip"
  );

  if (data === undefined) {
    return <InvoiceDetailsSkeleton />;
  }

  if (!data) {
    return null;
  }

  const {
    _id: id,
    customerId,
    amount,
    currency,
    status,
    vat,
    tax,
    paidAt,
    dueDate,
    issueDate,
    invoiceNumber,
    template,
    token,
    internalNote,
    updatedAt,
    sentAt,
    sentTo,
    customerName,
    customer,
  } = data;

  const handleDownload = async () => {
    if (!data.storageId) {
      return;
    }

    const url = await downloadFileAction(data.storageId);
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2 mt-1 items-center">
          <Avatar className="size-5">
            {customer?.website && (
              <AvatarImage
                src={getWebsiteLogo(customer?.website)}
                alt={`${customer?.name} logo`}
                width={20}
                height={20}
              />
            )}
            <AvatarFallback className="text-[9px] font-medium">
              {customer?.name?.at(0) || customerName?.at(0)}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm line-clamp-1">{customer?.name}</span>
        </div>
        <InvoiceStatus status={status} />
      </div>

      <div className="flex justify-between items-center mt-6 mb-3 relative">
        <div className="flex flex-col w-full space-y-1">
          <span
            className={cn("text-4xl font-mono select-text", {
              "line-through": status === "canceled",
            })}
          >
            {currency && (
              <FormatAmount amount={amount ?? 0} currency={currency} />
            )}
          </span>

          <div className="h-3 space-x-2">
            {vat !== 0 && vat != null && currency && (
              <span className="text-muted-foreground text-xs select-text">
                {template?.vatLabel}{" "}
                <FormatAmount amount={vat} currency={currency} />
              </span>
            )}

            {tax !== 0 && tax != null && currency && (
              <span className="text-muted-foreground text-xs select-text">
                {template?.taxLabel}{" "}
                <FormatAmount amount={tax} currency={currency} />
              </span>
            )}
          </div>
        </div>
      </div>

      <InvoiceActions status={status} id={id} companyId={companyId} />

      <div className="h-full p-0 pb-[143px] overflow-y-auto scrollbar-hide">
        {status === "paid" && (
          <div className="mt-8 flex flex-col space-y-1">
            <span className="text-base font-medium">
              Paid on {paidAt && format(new Date(paidAt), "MMM dd")}
            </span>
            <span className="text-xs">
              <span className="text-muted-foreground">Marked as paid</span>
            </span>
          </div>
        )}

        {status === "canceled" && (
          <div className="mt-8 flex flex-col space-y-1">
            <span className="text-base font-medium">
              Canceled on {updatedAt && format(new Date(updatedAt), "MMM dd")}
            </span>
            <span className="text-xs">
              <span className="text-muted-foreground">Marked as canceled</span>
            </span>
          </div>
        )}

        <div className="mt-6 flex flex-col space-y-4 border-t border-border pt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Due date</span>
            <span className="text-sm">
              <span>{dueDate && format(new Date(dueDate), "MMM dd")}</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Issue date</span>
            <span className="text-sm">
              <span>{issueDate && format(new Date(issueDate), "MMM dd")}</span>
            </span>
          </div>

          {sentAt && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sent at</span>
              <span className="text-sm">
                <span>{sentAt && format(new Date(sentAt), "MMM dd")}</span>
              </span>
            </div>
          )}

          {sentTo && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sent to</span>
              <span className="text-sm">{sentTo}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Invoice no.</span>
            <span className="text-sm">
              <span>{invoiceNumber}</span>
            </span>
          </div>
        </div>

        {customerId && (
          <div className="mt-6 flex flex-col space-y-2 border-t border-border pt-6">
            <span className="text-sm text-muted-foreground">Invoice link</span>
            <div className="flex w-full gap-2">
              <div className="flex-1 min-w-0 relative">
                <CopyInput
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${token}`}
                  className="pr-14"
                />

                <div className="absolute right-10 top-[11px] border-r border-border pr-2">
                  <OpenURL
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${token}`}
                  >
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </OpenURL>
                </div>
              </div>

              {status !== "draft" && (
                <Button
                  variant="secondary"
                  className="size-[38px] hover:bg-secondary shrink-0"
                  onClick={handleDownload}
                >
                  <div>
                    <ArrowDown className="size-4" />
                  </div>
                </Button>
              )}
            </div>
          </div>
        )}

        <Accordion
          type="multiple"
          className="mt-6"
          defaultValue={internalNote ? ["note", "activity"] : ["activity"]}
        >
          <AccordionItem value="activity">
            <AccordionTrigger>Activity</AccordionTrigger>
            <AccordionContent>
              <InvoiceActivity data={data} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="note">
            <AccordionTrigger>Internal note</AccordionTrigger>
            <AccordionContent>
              <InvoiceNote id={data._id} defaultValue={internalNote} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
