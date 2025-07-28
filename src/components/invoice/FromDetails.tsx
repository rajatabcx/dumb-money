"use client";

import { Editor } from "@/components/invoice/Editor";
import { Controller, useFormContext } from "react-hook-form";
import { LabelInput } from "./LabelInput";
import { api } from "../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Id } from "../../../convex/_generated/dataModel";

export function FromDetails({ companyId }: { companyId: Id<"company"> }) {
  const { control, watch } = useFormContext();
  const id = watch("id");

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  return (
    <div>
      <LabelInput
        name="template.fromLabel"
        className="mb-2 block"
        onSave={(value) => {
          updateTemplateMutation.mutate({
            template: { fromLabel: value },
            companyId: companyId,
          });
        }}
      />

      <Controller
        name="fromDetails"
        control={control}
        render={({ field }) => (
          <Editor
            // NOTE: This is a workaround to get the new content to render
            key={id}
            initialContent={field.value}
            onChange={field.onChange}
            onBlur={(content) => {
              updateTemplateMutation.mutate({
                template: {
                  fromDetails: content ? JSON.stringify(content) : undefined,
                },
                companyId: companyId,
              });
            }}
            className="min-h-[90px] [&>div]:min-h-[90px]"
          />
        )}
      />
    </div>
  );
}
