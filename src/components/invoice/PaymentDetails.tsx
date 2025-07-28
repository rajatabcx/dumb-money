"use client";

import { Editor } from "@/components/invoice/Editor";
import { Controller, useFormContext } from "react-hook-form";
import { LabelInput } from "./LabelInput";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

type Props = {
  companyId: Id<"company">;
};

export function PaymentDetails({ companyId }: Props) {
  const { control, watch } = useFormContext();
  const id = watch("id");

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  return (
    <div>
      <LabelInput
        name="template.paymentLabel"
        onSave={(value) => {
          updateTemplateMutation.mutate({
            template: { paymentLabel: value },
            companyId: companyId,
          });
        }}
        className="mb-2 block"
      />

      <Controller
        control={control}
        name="paymentDetails"
        render={({ field }) => (
          <Editor
            // NOTE: This is a workaround to get the new content to render
            key={id}
            initialContent={field.value}
            onChange={field.onChange}
            onBlur={(content) => {
              updateTemplateMutation.mutate({
                template: {
                  paymentDetails: content ? JSON.stringify(content) : undefined,
                },
                companyId: companyId,
              });
            }}
            className="min-h-[78px]"
          />
        )}
      />
    </div>
  );
}
