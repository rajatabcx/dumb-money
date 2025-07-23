"use client";

import { useInvoiceFilterParams } from "@/hooks/useInvoiceFilterParams";
import { InvoiceSummary } from "./InvoiceSummary";

export function InvoicesOpen() {
  const { data } = useSuspenseQuery(
    trpc.invoice.invoiceSummary.queryOptions({
      status: "unpaid",
    })
  );
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
      className="hidden sm:block text-left"
    >
      <InvoiceSummary
        data={data}
        totalInvoiceCount={totalInvoiceCount ?? 0}
        title="Open"
      />
    </button>
  );
}
