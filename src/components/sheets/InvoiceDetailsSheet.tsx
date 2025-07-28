import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import React from "react";
import { InvoiceDetails } from "../invoice/InvoiceDetails";

export function InvoiceDetailsSheet() {
  const { invoiceId, type, setParams } = useInvoiceParams();

  const isOpen = Boolean(invoiceId && type === "details");

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => setParams({ invoiceId: null, type: null })}
    >
      <SheetContent>
        <InvoiceDetails />
      </SheetContent>
    </Sheet>
  );
}
