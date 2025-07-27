import { useQueryStates } from "nuqs";
import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";
import { Id } from "../../convex/_generated/dataModel";

const invoiceFilterParamsSchema = {
  q: parseAsString.withDefault(""),
  statuses: parseAsArrayOf(parseAsString).withDefault([]),
  customers: parseAsArrayOf(parseAsString).withDefault([]),
  start: parseAsString.withDefault(""),
  end: parseAsString.withDefault(""),
};

export function useInvoiceFilterParams() {
  const [filter, setFilter] = useQueryStates(invoiceFilterParamsSchema);

  const updatedFilter = filter as {
    q: string;
    statuses: ("draft" | "overdue" | "paid" | "unpaid" | "canceled")[];
    customers: Id<"customers">[];
    start: string;
    end: string;
  };

  return {
    filter: updatedFilter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}

export const loadInvoiceFilterParams = createLoader(invoiceFilterParamsSchema);
