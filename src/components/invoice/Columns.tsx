"use client";

import { FormatAmount } from "@/components/common/FormatAmount";
import { InvoiceStatus } from "@/components/invoice/InvoiceStatus";
import { formatDate, getDueDateStatus } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import * as React from "react";
import { ActionsMenu } from "./ActionsMenu";
import { Eye } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { getWebsiteLogo } from "@/lib/invoice/logo";

export type Invoice = FunctionReturnType<
  typeof api.invoices.getCompanyInvoices
>["page"][number];

export type InvoiceTemplate = FunctionReturnType<
  typeof api.invoices.defaultSettings
>;

export const columns: ColumnDef<Invoice>[] = [
  {
    header: "Invoice no.",
    accessorKey: "invoiceNumber",
    meta: {
      className:
        "w-[220px] min-w-[220px] md:sticky md:left-0 bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-secondary z-20 border-r border-border before:absolute before:right-0 before:top-0 before:bottom-0 before:w-px before:bg-border after:absolute after:right-[-24px] after:top-0 after:bottom-0 after:w-6 after:bg-gradient-to-l after:from-transparent after:to-background group-hover:after:to-muted after:z-[-1]",
    },
    cell: ({ row }) => row.getValue("invoiceNumber"),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <InvoiceStatus status={row.getValue("status")} />,
  },
  {
    header: "Due date",
    accessorKey: "dueDate",
    cell: ({ row, table }) => {
      const date = row.original.dueDate;

      const showDate =
        row.original.status === "unpaid" || row.original.status === "overdue";

      return (
        <div className="flex flex-col space-y-1 w-[80px]">
          <span>
            {date
              ? formatDate(
                  date,
                  (table.options.meta as any)?.dateFormat ?? null
                )
              : "-"}
          </span>
          {showDate && (
            <span className="text-xs text-muted-foreground">
              {date ? getDueDateStatus(date as string) : "-"}
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "Customer",
    accessorKey: "customer",
    cell: ({ row }) => {
      const customer = row.original.customer;
      const name = customer?.name || row.original.customerName;
      const viewAt = row.original.viewedAt;

      console.log(getWebsiteLogo(customer?.website));

      if (!name) return "-";
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-5">
            {customer?.website && (
              <AvatarImage
                src={getWebsiteLogo(customer?.website)}
                alt={`${name} logo`}
                width={20}
                height={20}
              />
            )}
            <AvatarFallback className="text-[9px] font-medium">
              {name?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{name}</span>

          {viewAt && row.original.status !== "paid" && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="flex items-center space-x-2">
                  <Eye className="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent
                  className="text-xs py-1 px-2"
                  side="right"
                  sideOffset={5}
                >
                  {viewAt
                    ? `Viewed ${formatDistanceToNow(new Date(viewAt))} ago`
                    : ""}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      if (!row.original.amount) return "-";
      return (
        <span
          className={cn("flex items-center gap-2", {
            "line-through": row.original.status === "canceled",
          })}
        >
          <FormatAmount
            amount={row.original.amount}
            currency={row.original.currency ?? "USD"}
          />
        </span>
      );
    },
  },
  {
    header: "VAT Rate",
    accessorKey: "vatRate",
    cell: ({ row }) => {
      const vatRate = row.original.template.vatRate as number | undefined;
      return vatRate !== undefined && vatRate !== null ? `${vatRate}%` : "-";
    },
  },
  {
    header: "VAT Amount",
    accessorKey: "vatAmount",
    cell: ({ row }) => (
      <FormatAmount
        amount={(row.original?.vat as number) ?? null}
        currency={row.original.currency ?? "USD"}
      />
    ),
  },
  {
    header: "Tax Rate",
    accessorKey: "taxRate",
    cell: ({ row }) => {
      const taxRate = row.original.template.taxRate as number | undefined;
      return taxRate !== undefined && taxRate !== null ? `${taxRate}%` : "-";
    },
  },
  {
    header: "Tax Amount",
    accessorKey: "taxAmount",
    cell: ({ row }) => (
      <FormatAmount
        amount={(row.original.tax as number) ?? null}
        currency={row.original.currency ?? "USD"}
      />
    ),
  },
  {
    header: "Excl. VAT",
    accessorKey: "exclVat",
    cell: ({ row }) => (
      <FormatAmount
        amount={(row.original.amount as number) - (row.original.vat as number)}
        currency={row.original.currency ?? "USD"}
      />
    ),
  },
  {
    header: "Excl. Tax",
    accessorKey: "exclTax",
    cell: ({ row }) => (
      <FormatAmount
        amount={(row.original.amount as number) - (row.original.tax as number)}
        currency={row.original.currency ?? "USD"}
      />
    ),
  },
  {
    header: "Internal Note",
    accessorKey: "internalNote",
    cell: ({ row }) => {
      return <span className="truncate">{row.original.internalNote}</span>;
    },
  },
  {
    header: "Issue date",
    accessorKey: "issueDate",
    cell: ({ row, table }) => {
      const date = row.original.issueDate;
      return (
        <span>
          {date
            ? formatDate(date, (table.options.meta as any)?.dateFormat)
            : "-"}
        </span>
      );
    },
  },
  {
    header: "Sent at",
    accessorKey: "sentAt",
    cell: ({ row, table }) => {
      const sentAt = row.original.sentAt;
      const sentTo = row.original.sentTo;

      if (!sentAt) {
        return "-";
      }

      if (!sentTo) {
        return formatDate(sentAt, (table.options.meta as any)?.dateFormat);
      }

      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger className="flex items-center space-x-2">
              {formatDate(sentAt, (table.options.meta as any)?.dateFormat)}
            </TooltipTrigger>
            <TooltipContent
              className="text-xs py-1 px-2"
              side="right"
              sideOffset={5}
            >
              {sentTo}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: {
      className:
        "text-right md:sticky md:right-0 bg-background group-hover:bg-[#F2F1EF] group-hover:dark:bg-secondary z-30 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border after:absolute after:left-[-24px] after:top-0 after:bottom-0 after:w-6 after:bg-gradient-to-r after:from-transparent after:to-background group-hover:after:to-muted after:z-[-1]",
    },
    cell: ({ row }) => {
      return (
        <ActionsMenu row={row.original} companyId={row.original.companyId} />
      );
    },
  },
];
