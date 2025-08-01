"use client";

import { InvoiceContent } from "@/components/invoice/InvoiceContent";
import { FormContext } from "@/components/invoice/FormContext";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Sheet } from "@/components/ui/sheet";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function InvoiceSheet({ companyId }: { companyId: Id<"company"> }) {
  const { setParams, type, invoiceId } = useInvoiceParams();
  const isOpen = type === "create" || type === "edit" || type === "success";

  // Get default settings for new invoices
  const defaultSettings = useQuery(api.invoices.defaultSettings, {
    companyId: companyId,
  });

  // Get draft invoice for edit
  const data = useQuery(
    api.invoices.getInvoice,
    invoiceId
      ? {
          id: invoiceId,
        }
      : "skip"
  );

  const handleOnOpenChange = (open: boolean) => {
    setParams(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      <FormContext defaultSettings={defaultSettings} data={data} type={type}>
        <InvoiceContent companyId={companyId} />
      </FormContext>
    </Sheet>
  );
}
