"use client";

import { useZodForm } from "@/hooks/useZodForm";
import {
  invoiceTemplateSchema,
  lineItemSchema,
} from "@/lib/invoice/validationSchemas";
import { FunctionReturnType } from "convex/server";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";

export const invoiceFormSchema = z.object({
  id: z.string(),
  status: z.string(),
  template: invoiceTemplateSchema,
  fromDetails: z.any(),
  customerDetails: z.any(),
  customerId: z.string(),
  customerName: z.string().optional(),
  paymentDetails: z.any(),
  noteDetails: z.any().optional(),
  dueDate: z.string(),
  issueDate: z.string(),
  invoiceNumber: z.string(),
  logoUrl: z.string().nullable().optional(),
  vat: z.number().nullable().optional(),
  tax: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  subtotal: z.number().nullable().optional(),
  topBlock: z.any().nullable().optional(),
  bottomBlock: z.any().nullable().optional(),
  amount: z.number(),
  lineItems: z.array(lineItemSchema).min(1),
  token: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

type Invoice = FunctionReturnType<typeof api.invoices.getInvoice>;
type InvoiceTemplate = FunctionReturnType<typeof api.invoices.defaultSettings>;

type FormContextProps = {
  children: React.ReactNode;
  data?: Invoice;
  defaultSettings?: InvoiceTemplate;
};

export function FormContext({
  children,
  data,
  defaultSettings,
}: FormContextProps) {
  const form = useZodForm(invoiceFormSchema, {
    defaultValues: defaultSettings ?? {},
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      ...(defaultSettings ?? {}),
      ...(data ?? {}),
      template: {
        ...(defaultSettings?.template ?? {}),
        ...(data?.template ?? {}),
      },
      customerId: data?.customerId ?? defaultSettings?.customerId ?? undefined,
    });
  }, [data, defaultSettings]);

  return <FormProvider {...form}>{children}</FormProvider>;
}
