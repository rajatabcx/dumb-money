import { Id } from "../../../convex/_generated/dataModel";
import { InvoiceColumnVisibility } from "./InvoiceColumnVisibility";
import { InvoiceSearchFilter } from "./InvoiceSearchFilter";
import { OpenInvoiceSheet } from "./OpenInvoiceSheet";

export function InvoiceHeader({ companyId }: { companyId: Id<"company"> }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <InvoiceSearchFilter companyId={companyId} />

      <div className="flex gap-2">
        <div className="hidden sm:block">
          <InvoiceColumnVisibility />
        </div>
        <OpenInvoiceSheet />
      </div>
    </div>
  );
}
