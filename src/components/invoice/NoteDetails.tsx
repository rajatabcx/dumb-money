"use client";

import { Editor } from "@/components/invoice/Editor";
import { Controller, useFormContext } from "react-hook-form";
import { LabelInput } from "./LabelInput";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  companyId: Id<"company">;
};

export function NoteDetails({ companyId }: Props) {
  const { control, watch } = useFormContext();
  const id = watch("id");

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  return (
    <div>
      <LabelInput
        name="template.noteLabel"
        onSave={(value) => {
          updateTemplateMutation.mutate({
            template: { noteLabel: value },
            companyId: companyId,
          });
        }}
        className="mb-2 block"
      />

      <Controller
        control={control}
        name="noteDetails"
        render={({ field }) => {
          return (
            <Editor
              // NOTE: This is a workaround to get the new content to render
              key={id}
              initialContent={field.value}
              onChange={field.onChange}
              className="min-h-[78px]"
            />
          );
        }}
      />
    </div>
  );
}
