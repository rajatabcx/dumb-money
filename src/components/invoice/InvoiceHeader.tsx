import { Id } from "../../../convex/_generated/dataModel";
import { InvoiceColumnVisibility } from "./InvoiceColumnVisibility";
import { InvoiceSearchFilter } from "./InvoiceSearchFilter";
import { OpenInvoiceSheet } from "./OpenInvoiceSheet";

export function InvoiceHeader({ companyId }: { companyId: Id<"company"> }) {
  return (
    <div className="flex items-center justify-between">
      <InvoiceSearchFilter companyId={companyId} />

      <div className="hidden sm:flex space-x-2">
        <InvoiceColumnVisibility />
        <OpenInvoiceSheet />
      </div>
    </div>
  );
}
