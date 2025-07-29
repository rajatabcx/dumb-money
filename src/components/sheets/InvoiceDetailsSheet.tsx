import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import React from "react";
import { InvoiceDetails } from "../invoice/InvoiceDetails";
import { Id } from "../../../convex/_generated/dataModel";

export function InvoiceDetailsSheet({
  companyId,
}: {
  companyId: Id<"company">;
}) {
  const { invoiceId, type, setParams } = useInvoiceParams();

  const isOpen = Boolean(invoiceId && type === "details");

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => setParams({ invoiceId: null, type: null })}
    >
      <SheetContent>
        <InvoiceDetails companyId={companyId} />
      </SheetContent>
    </Sheet>
  );
}
