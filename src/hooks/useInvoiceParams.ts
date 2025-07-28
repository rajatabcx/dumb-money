import { useQueryStates } from "nuqs";
import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";
import { Id } from "../../convex/_generated/dataModel";
import { update } from "../../convex/company";

const invoiceParamsSchema = {
  selectedCustomerId: parseAsString,
  type: parseAsStringEnum(["edit", "create", "details", "success"]),
  invoiceId: parseAsString,
};

export function useInvoiceParams() {
  const [params, setParams] = useQueryStates(invoiceParamsSchema);

  const updatedParams = {
    ...params,
  } as {
    selectedCustomerId: Id<"customers"> | null;
    type: "edit" | "create" | "details" | "success" | null;
    invoiceId: Id<"invoices"> | null;
  };

  return {
    ...updatedParams,
    setParams,
  };
}

export const loadInvoiceParams = createLoader(invoiceParamsSchema);
