import { DataTable } from "@/components/invoice/DataTable";
import { ErrorFallback } from "@/components/invoice/ErrorFallback";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import {
  InvoicePaymentScore,
  InvoicePaymentScoreSkeleton,
} from "@/components/invoice/InvoicePaymentScore";
import { InvoicesOpen } from "@/components/invoice/invoices-open";
import { InvoicesOverdue } from "@/components/invoice/invoices-overdue";
import { InvoicesPaid } from "@/components/invoice/invoices-paid";
import { InvoiceSummarySkeleton } from "@/components/invoice/InvoiceSummary";
import { InvoiceSkeleton } from "@/components/invoice/Skeleton";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Invoices | Midday",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const columnVisibility = getInitialInvoicesColumnVisibility();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
        <Suspense fallback={<InvoiceSummarySkeleton />}>
          <InvoicesOpen />
        </Suspense>
        <Suspense fallback={<InvoiceSummarySkeleton />}>
          <InvoicesOverdue />
        </Suspense>
        <Suspense fallback={<InvoiceSummarySkeleton />}>
          <InvoicesPaid />
        </Suspense>
        <Suspense fallback={<InvoicePaymentScoreSkeleton />}>
          <InvoicePaymentScore />
        </Suspense>
      </div>

      <InvoiceHeader />

      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<InvoiceSkeleton />}>
          <DataTable columnVisibility={columnVisibility} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
