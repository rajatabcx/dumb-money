"use client";

import { useInvoiceFilterParams } from "@/hooks/useInvoiceFilterParams";
import { InvoiceSummary } from "./InvoiceSummary";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function InvoicesOverdue({ companyId }: { companyId: Id<"company"> }) {
  const { setFilter } = useInvoiceFilterParams();
  const data = useQuery(api.invoices.invoiceSummary, {
    status: "overdue",
    companyId,
  });

  const totalInvoiceCount = data?.at(0)?.invoiceCount;

  return (
    <button
      type="button"
      onClick={() =>
        setFilter({
          statuses: ["overdue"],
        })
      }
      className="hidden sm:block text-left cursor-pointer"
    >
      <InvoiceSummary
        data={data ?? []}
        totalInvoiceCount={totalInvoiceCount ?? 0}
        title="Overdue"
      />
    </button>
  );
}
