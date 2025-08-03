"use client";

import { useInvoiceFilterParams } from "@/hooks/useInvoiceFilterParams";
import { InvoiceSummary } from "./InvoiceSummary";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function InvoicesOpen({ companyId }: { companyId: Id<"company"> }) {
  const data = useQuery(api.invoices.invoiceSummary, {
    status: "unpaid",
    companyId,
  });
  const { setFilter } = useInvoiceFilterParams();

  const totalInvoiceCount = data?.reduce(
    (acc, curr) => acc + (curr.invoiceCount ?? 0),
    0
  );

  return (
    <button
      type="button"
      onClick={() =>
        setFilter({
          statuses: ["draft", "overdue", "unpaid"],
        })
      }
      className="hidden sm:block text-left cursor-pointer"
    >
      <InvoiceSummary
        data={data ?? []}
        totalInvoiceCount={totalInvoiceCount ?? 0}
        title="Open"
      />
    </button>
  );
}
