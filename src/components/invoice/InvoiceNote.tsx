"use client";

import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  id: Id<"invoices">;
  defaultValue?: string | null;
};

export function InvoiceNote({ id, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [debouncedValue] = useDebounceValue(value, 500);

  const updateInvoiceMutation = useApiMutation(api.invoices.update);

  useEffect(() => {
    if (debouncedValue !== defaultValue) {
      updateInvoiceMutation.mutate({
        id,
        internalNote:
          debouncedValue && debouncedValue.length > 0
            ? debouncedValue
            : undefined,
      });
    }
  }, [debouncedValue, defaultValue, id, updateInvoiceMutation]);

  return (
    <Textarea
      defaultValue={defaultValue ?? ""}
      id="note"
      placeholder="Note"
      className="min-h-[100px] resize-none"
      onChange={(evt) => setValue(evt.target.value)}
    />
  );
}
