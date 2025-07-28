"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormContext } from "react-hook-form";
import { uniqueCurrencies } from "@/lib/currencies";
import {
  Calculator,
  CalendarRange,
  DecimalsArrowRight,
  DollarSign,
  Landmark,
  MailPlus,
  Milestone,
  MoreVertical,
  QrCode,
  Ruler,
  Scan,
  Ticket,
} from "lucide-react";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { SelectCurrency } from "../common/SelectCurrency";
import { Id } from "../../../convex/_generated/dataModel";

const dateFormats = [
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
  { value: "dd.MM.yyyy", label: "dd.MM.yyyy" },
];

const invoiceSizes = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

const booleanOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const menuItems = [
  {
    icon: CalendarRange,
    label: "Date format",
    options: dateFormats,
    key: "dateFormat",
  },
  {
    icon: Scan,
    label: "Invoice size",
    options: invoiceSizes,
    key: "size",
  },
  {
    icon: Landmark,
    label: "Add sales tax",
    options: booleanOptions,
    key: "includeTax",
  },
  {
    icon: Calculator,
    label: "Add VAT",
    options: booleanOptions,
    key: "includeVat",
  },
  {
    icon: DollarSign,
    label: "Currency",
    options: uniqueCurrencies.map((currency) => ({
      value: currency,
      label: currency,
    })),
    key: "currency",
  },
  {
    icon: Ticket,
    label: "Add discount",
    options: booleanOptions,
    key: "includeDiscount",
  },
  {
    icon: MailPlus,
    label: "Attach PDF in email",
    options: booleanOptions,
    key: "includePdf",
  },
  {
    icon: Milestone,
    label: "Send copy (BCC)",
    options: booleanOptions,
    key: "sendCopy",
  },
  {
    icon: Ruler,
    label: "Add units",
    options: booleanOptions,
    key: "includeUnits",
  },
  {
    icon: DecimalsArrowRight,
    label: "Decimals",
    options: booleanOptions,
    key: "includeDecimals",
  },
  {
    icon: QrCode,
    label: "Add QR code",
    options: booleanOptions,
    key: "includeQr",
  },
];

export function SettingsMenu({ companyId }: { companyId: Id<"company"> }) {
  const { watch, setValue } = useFormContext();
  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">
          <MoreVertical className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {menuItems.map((item, index) => {
          const watchKey = `template.${item.key}`;

          if (item.key === "currency") {
            return (
              <DropdownMenuSub key={index.toString()}>
                <DropdownMenuSubTrigger>
                  <item.icon className="mr-2 size-4" />
                  <span className="text-xs">{item.label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-0">
                  <SelectCurrency
                    headless
                    className="text-xs"
                    currencies={uniqueCurrencies}
                    value={watch(watchKey)}
                    onChange={(value) => {
                      setValue(watchKey, value, {
                        shouldValidate: true,
                      });
                      updateTemplateMutation.mutate({
                        template: {
                          [item.key]: value,
                        },
                        companyId: companyId,
                      });
                    }}
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          return (
            <DropdownMenuSub key={index.toString()}>
              <DropdownMenuSubTrigger>
                <item.icon className="mr-2 size-4" />
                <span className="text-xs">{item.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0 max-h-48 overflow-y-auto">
                {item.options.map((option, optionIndex) => (
                  <DropdownMenuCheckboxItem
                    key={optionIndex.toString()}
                    className="text-xs"
                    checked={watch(watchKey) === option.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue(watchKey, option.value, {
                          shouldValidate: true,
                        });

                        updateTemplateMutation.mutate({
                          template: {
                            [item.key]: option.value,
                          },
                          companyId: companyId,
                        });
                      }
                    }}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
