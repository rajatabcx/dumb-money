"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "./Input";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  companyId: Id<"company">;
};

export function InvoiceTitle({ companyId }: Props) {
  const { watch } = useFormContext();
  const invoiceTitle = watch("template.title");

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  return (
    <Input
      className="text-[21px] font-medium mb-2 w-fit min-w-[100px] !border-none"
      name="template.title"
      onBlur={() => {
        updateTemplateMutation.mutate({
          template: { title: invoiceTitle },
          companyId: companyId,
        });
      }}
    />
  );
}
