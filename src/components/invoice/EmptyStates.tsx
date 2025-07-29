"use client";

import { useInvoiceFilterParams } from "@/hooks/useInvoiceFilterParams";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  const { setParams } = useInvoiceParams();

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col items-center mt-40">
        <div className="text-center mb-6 space-y-2">
          <h2 className="font-medium text-lg text-primary">No invoices</h2>
          <p className="text-muted-foreground text-sm">
            You haven't created any invoices yet. <br />
            Go ahead and create your first one.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setParams({
              type: "create",
            })
          }
        >
          Create invoice
        </Button>
      </div>
    </div>
  );
}

export function NoResults() {
  const { setFilter } = useInvoiceFilterParams();

  return (
    <div className="flex items-center justify-center ">
      <div className="flex flex-col items-center mt-40">
        <div className="text-center mb-6 space-y-2">
          <h2 className="font-medium text-lg">No results</h2>
          <p className="text-muted-foreground text-sm">
            Try another search, or adjusting the filters
          </p>
        </div>

        <Button variant="outline" onClick={() => setFilter(null)}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}
