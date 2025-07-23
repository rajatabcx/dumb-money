"use client";

import { InvoiceContent } from "@/components/invoice/InvoiceContent";
import { FormContext } from "@/components/invoice/FormContext";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Sheet } from "@/components/ui/sheet";
import React from "react";

export function InvoiceSheet() {
  const { setParams, type, invoiceId } = useInvoiceParams();
  const isOpen = type === "create" || type === "edit" || type === "success";

  // Get default settings for new invoices
  const { data: defaultSettings, refetch } = useSuspenseQuery(
    trpc.invoice.defaultSettings.queryOptions()
  );

  // Get draft invoice for edit
  const { data } = useQuery(
    trpc.invoice.getById.queryOptions(
      {
        id: invoiceId!,
      },
      {
        enabled: !!invoiceId,
      }
    )
  );

  const handleOnOpenChange = (open: boolean) => {
    // Refetch default settings when the sheet is closed
    if (!open) {
      refetch();
    }

    setParams(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      <FormContext defaultSettings={defaultSettings} data={data}>
        <InvoiceContent />
      </FormContext>
    </Sheet>
  );
}
