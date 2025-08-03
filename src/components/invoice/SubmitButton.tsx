"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubmitButton as BaseSubmitButton } from "@/components/ui/submit-button";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useFormContext } from "react-hook-form";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";

type Props = {
  isSubmitting: boolean;
  disabled?: boolean;
  companyId: Id<"company">;
};

export function SubmitButton({ isSubmitting, disabled, companyId }: Props) {
  const { watch, setValue, formState } = useFormContext();

  const selectedOption = watch("template.deliveryType");
  const canUpdate = watch("status") !== "draft";

  const invoiceNumberValid = !formState.errors.invoiceNumber;

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  const handleOptionChange = (value: string) => {
    const deliveryType = value as "create" | "create_and_send";

    updateTemplateMutation.mutate({
      template: {
        deliveryType,
      },
      companyId: companyId,
    });

    setValue("template.deliveryType", deliveryType, {
      shouldValidate: true,
    });
  };

  const isValid = formState.isValid && invoiceNumberValid;

  const options = [
    {
      label: canUpdate ? "Update" : "Create",
      value: "create",
    },
    {
      label: canUpdate ? "Update & Send" : "Create & Send",
      value: "create_and_send",
    },
  ];

  return (
    <div className="flex divide-x">
      <BaseSubmitButton
        isSubmitting={isSubmitting}
        disabled={!isValid || disabled}
        className="cursor-pointer"
      >
        {options.find((o) => o.value === selectedOption)?.label}
      </BaseSubmitButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={!isValid || isSubmitting || disabled}
            className="size-9 p-0 [&[data-state=open]>svg]:rotate-180"
          >
            <ChevronDown className="size-4 transition-transform duration-200" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10}>
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedOption === option.value}
              onCheckedChange={() => handleOptionChange(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
