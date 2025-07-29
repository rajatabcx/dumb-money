import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { Id } from "../../convex/_generated/dataModel";

export function useCustomerParams() {
  const [params, setParams] = useQueryStates({
    customerId: parseAsString,
    createCustomer: parseAsBoolean,
    name: parseAsString,
    q: parseAsString,
  });

  const modifiedParams = {
    ...params,
  } as {
    customerId: Id<"customers"> | null;
    createCustomer: boolean;
    name: string | null;
    q: string | null;
  };

  return {
    ...modifiedParams,
    setParams,
  };
}
