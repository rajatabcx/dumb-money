import { getInitialInvoicesColumnVisibility } from "@/actions/columns";
import { DataTable } from "@/components/invoice/DataTable";
import { ErrorFallback } from "@/components/invoice/ErrorFallback";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoicesOpen } from "@/components/invoice/invoices-open";
import { InvoicesOverdue } from "@/components/invoice/invoices-overdue";
import { InvoicesPaid } from "@/components/invoice/invoices-paid";
import { InvoiceSummarySkeleton } from "@/components/invoice/InvoiceSummary";
import { InvoiceSkeleton } from "@/components/invoice/Skeleton";
import { getAuthToken } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { api } from "../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { storefrontRoute } from "@/lib/routeHelpers";

export const metadata: Metadata = {
  title: "Invoices | Midday",
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const columnVisibility = getInitialInvoicesColumnVisibility();
  const token = await getAuthToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (!user?.companyId) {
    redirect(storefrontRoute());
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-6">
        <Suspense fallback={<InvoiceSummarySkeleton />}>
          <InvoicesOpen companyId={user.companyId} />
        </Suspense>
        <Suspense fallback={<InvoiceSummarySkeleton />}>
          <InvoicesOverdue companyId={user.companyId} />
        </Suspense>
        <Suspense fallback={<InvoiceSummarySkeleton />}>
          <InvoicesPaid companyId={user.companyId} />
        </Suspense>
      </div>

      <InvoiceHeader companyId={user.companyId} />

      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<InvoiceSkeleton />}>
          <DataTable
            columnVisibility={columnVisibility}
            companyId={user.companyId}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
