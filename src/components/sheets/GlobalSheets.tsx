"use client";

import { CustomerCreateSheet } from "@/components/sheets/CustomerCreateSheet";
import { CustomerEditSheet } from "@/components/sheets/CustomerEditSheet";
import { InvoiceDetailsSheet } from "@/components/sheets/InvoiceDetailsSheet";
import { InvoiceSheet } from "@/components/sheets/InvoiceSheet";
import { Id } from "../../../convex/_generated/dataModel";

export function GlobalSheets({ companyId }: { companyId: Id<"company"> }) {
  return (
    <>
      {/* <CustomerCreateSheet /> */}
      {/* <CustomerEditSheet /> */}

      {/* <InvoiceDetailsSheet /> */}
      <InvoiceSheet companyId={companyId} />
    </>
  );
}
