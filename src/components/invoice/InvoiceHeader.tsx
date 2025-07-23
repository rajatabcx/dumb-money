import { InvoiceColumnVisibility } from "./InvoiceColumnVisibility";
import { InvoiceSearchFilter } from "./InvoiceSearchFilter";
import { OpenInvoiceSheet } from "./OpenInvoiceSheet";

export function InvoiceHeader() {
  return (
    <div className="flex items-center justify-between">
      <InvoiceSearchFilter />

      <div className="hidden sm:flex space-x-2">
        <InvoiceColumnVisibility />
        <OpenInvoiceSheet />
      </div>
    </div>
  );
}
