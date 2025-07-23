import { DueDate } from "./DueDate";
import { InvoiceNo } from "./InvoiceNo";
import { InvoiceTitle } from "./InvoiceTitle";
import { IssueDate } from "./IssueDate";

export function Meta() {
  return (
    <div>
      <InvoiceTitle />

      <div className="flex flex-col gap-0.5">
        <div>
          <InvoiceNo />
        </div>
        <div>
          <IssueDate />
        </div>
        <div>
          <DueDate />
        </div>
      </div>
    </div>
  );
}
