import { calculateTotal } from "@/lib/invoice/calculate";
import { useCallback, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { FormatAmount } from "@/components/common/FormatAmount";
import { AmountInput } from "./AmountInput";
import { LabelInput } from "./LabelInput";
import { TaxInput } from "./TaxInput";
import { VATInput } from "./VatInput";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function Summary({ companyId }: { companyId: Id<"company"> }) {
  const { control, setValue } = useFormContext();

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  const includeDecimals = useWatch({
    control,
    name: "template.includeDecimals",
  });

  const maximumFractionDigits = includeDecimals ? 2 : 0;

  const currency = useWatch({
    control,
    name: "template.currency",
  });

  const locale = useWatch({
    control,
    name: "template.locale",
  });

  const includeTax = useWatch({
    control,
    name: "template.includeTax",
  });

  const taxRate = useWatch({
    control,
    name: "template.taxRate",
  });

  const vatRate = useWatch({
    control,
    name: "template.vatRate",
  });

  const includeVat = useWatch({
    control,
    name: "template.includeVat",
  });

  const includeDiscount = useWatch({
    control,
    name: "template.includeDiscount",
  });

  const lineItems = useWatch({
    control,
    name: "lineItems",
  });

  const discount = useWatch({
    control,
    name: "discount",
  });

  const {
    subTotal,
    total,
    vat: totalVAT,
    tax: totalTax,
  } = calculateTotal({
    lineItems,
    taxRate,
    vatRate,
    includeTax,
    discount: discount ?? 0,
  });

  const updateFormValues = useCallback(() => {
    setValue("amount", total, { shouldValidate: true });
    setValue("vat", totalVAT, { shouldValidate: true });
    setValue("tax", totalTax, { shouldValidate: true });
    setValue("subtotal", subTotal, { shouldValidate: true });
    setValue("discount", discount ?? 0, { shouldValidate: true });
  }, [total, totalVAT, totalTax, subTotal, discount]);

  useEffect(() => {
    updateFormValues();
  }, [updateFormValues]);

  useEffect(() => {
    if (!includeTax) {
      setValue("template.taxRate", 0, { shouldValidate: true });
    }
  }, [includeTax]);

  useEffect(() => {
    if (!includeVat) {
      setValue("template.vatRate", 0, { shouldValidate: true });
    }
  }, [includeVat]);

  useEffect(() => {
    if (!includeDiscount) {
      setValue("discount", 0, { shouldValidate: true });
    }
  }, [includeDiscount]);

  return (
    <div className="w-[320px] flex flex-col">
      <div className="flex justify-between items-center py-1">
        <LabelInput
          className="flex-shrink-0 min-w-6"
          name="template.subtotalLabel"
          onSave={(value) => {
            updateTemplateMutation.mutate({
              companyId,
              template: { subtotalLabel: value },
            });
          }}
        />
        <span className="text-right font-mono text-[11px] text-muted-foreground">
          <FormatAmount
            amount={subTotal}
            maximumFractionDigits={maximumFractionDigits}
            currency={currency}
            locale={locale}
          />
        </span>
      </div>

      {includeDiscount && (
        <div className="flex justify-between items-center py-1">
          <LabelInput
            name="template.discountLabel"
            onSave={(value) => {
              updateTemplateMutation.mutate({
                companyId,
                template: { discountLabel: value },
              });
            }}
          />

          <AmountInput
            placeholder="0"
            allowNegative={false}
            name="discount"
            className="text-right font-mono text-[11px] text-muted-foreground border-none"
          />
        </div>
      )}

      {includeVat && (
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-1">
            <LabelInput
              className="flex-shrink-0 min-w-5"
              name="template.vatLabel"
              onSave={(value) => {
                updateTemplateMutation.mutate({
                  companyId,
                  template: { vatLabel: value },
                });
              }}
            />

            <VATInput />
          </div>

          <span className="text-right font-mono text-[11px] text-muted-foreground">
            <FormatAmount
              amount={totalVAT}
              maximumFractionDigits={maximumFractionDigits}
              currency={currency}
              locale={locale}
            />
          </span>
        </div>
      )}

      {includeTax && (
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-1">
            <LabelInput
              className="flex-shrink-0 min-w-5"
              name="template.taxLabel"
              onSave={(value) => {
                updateTemplateMutation.mutate({
                  companyId,
                  template: { taxLabel: value },
                });
              }}
            />

            <TaxInput />
          </div>

          <span className="text-right font-mono text-[11px] text-muted-foreground">
            <FormatAmount
              amount={totalTax}
              maximumFractionDigits={maximumFractionDigits}
              currency={currency}
            />
          </span>
        </div>
      )}

      <div className="flex justify-between items-center py-4 mt-2 border-t border-border">
        <LabelInput
          name="template.totalLabel"
          onSave={(value) => {
            updateTemplateMutation.mutate({
              companyId,
              template: { totalLabel: value },
            });
          }}
        />
        <span className="text-right font-mono font-medium text-[21px]">
          <AnimatedNumber
            value={total}
            currency={currency}
            maximumFractionDigits={maximumFractionDigits}
          />
        </span>
      </div>
    </div>
  );
}
