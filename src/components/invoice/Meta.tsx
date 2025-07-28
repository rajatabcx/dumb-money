import { Id } from "../../../convex/_generated/dataModel";
import { DueDate } from "./DueDate";
import { InvoiceNo } from "./InvoiceNo";
import { InvoiceTitle } from "./InvoiceTitle";
import { IssueDate } from "./IssueDate";

export function Meta({ companyId }: { companyId: Id<"company"> }) {
  return (
    <div>
      <InvoiceTitle companyId={companyId} />

      <div className="flex flex-col gap-0.5">
        <div>
          <InvoiceNo companyId={companyId} />
        </div>
        <div>
          <IssueDate companyId={companyId} />
        </div>
        <div>
          <DueDate companyId={companyId} />
        </div>
      </div>
    </div>
  );
}
