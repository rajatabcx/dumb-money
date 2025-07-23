"use client";

import { InvoiceSuccess } from "@/components/invoice-success";
import { Form } from "@/components/invoice/Form";
import { SettingsMenu } from "@/components/invoice/SettingsMenu";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useFormContext } from "react-hook-form";

export function InvoiceContent() {
  const { type } = useInvoiceParams();
  const { watch } = useFormContext();
  const templateSize = watch("template.size");

  const size = templateSize === "a4" ? 650 : 740;

  if (type === "success") {
    return (
      <SheetContent className="bg-white dark:bg-[#0C0C0C] transition-[max-width] duration-300 ease-in-out">
        <InvoiceSuccess />
      </SheetContent>
    );
  }

  return (
    <SheetContent
      style={{ maxWidth: size }}
      className="bg-white dark:bg-[#0C0C0C] transition-[max-width] duration-300 ease-in-out"
    >
      <SheetHeader className="mb-6 flex justify-between items-center flex-row">
        <div className="ml-auto">
          <SettingsMenu />
        </div>
      </SheetHeader>

      <Form />
    </SheetContent>
  );
}
