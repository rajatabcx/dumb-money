"use client";

import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "./Input";
import { LabelInput } from "./LabelInput";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";

export function InvoiceNo({ companyId }: { companyId: Id<"company"> }) {
  const {
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const invoiceNumber = watch("invoiceNumber");

  console.log(invoiceNumber);
  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  const { type } = useInvoiceParams();

  const data = useQuery(
    api.invoices.searchInvoiceNumber,
    type === "create" && invoiceNumber !== ""
      ? {
          query: invoiceNumber,
          companyId,
        }
      : "skip"
  );

  console.log(data);

  useEffect(() => {
    if (data) {
      setError("invoiceNumber", {
        type: "manual",
        message: "Invoice number already exists",
      });
    } else {
      clearErrors("invoiceNumber");
    }
  }, [data]);

  return (
    <div className="flex space-x-1 items-center">
      <div className="flex items-center flex-shrink-0">
        <LabelInput
          name="template.invoiceNoLabel"
          onSave={(value) => {
            updateTemplateMutation.mutate({
              companyId,
              template: { invoiceNoLabel: value },
            });
          }}
          className="truncate"
        />
        <span className="text-[11px] text-muted-foreground font-mono flex-shrink-0">
          :
        </span>
      </div>

      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Input
                name="invoiceNumber"
                className={cn(
                  "w-28 flex-shrink p-0 border-none text-[11px] h-4.5 overflow-hidden",
                  errors.invoiceNumber ? "text-red-500" : ""
                )}
              />
            </div>
          </TooltipTrigger>
          {errors.invoiceNumber && (
            <TooltipContent className="text-xs px-3 py-1.5">
              <p>Invoice number already exists</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
