import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { useTRPC } from "@/trpc/client";
import { formatRelativeTime } from "@/lib/format";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { OpenURL } from "@/components/common/OpenUrl";
import { CustomerDetails } from "./CustomerDetails";
import { EditBlock } from "./EditBlock";
import type { InvoiceFormValues } from "./FormContext";
import { FromDetails } from "./FromDetails";
import { LineItems } from "./LineItems";
import { Logo } from "./Logo";
import { Meta } from "./Meta";
import { NoteDetails } from "./NoteDetails";
import { PaymentDetails } from "./PaymentDetails";
import { SubmitButton } from "./SubmitButton";
import { Summary } from "./Summary";
import { transformFormValuesToDraft } from "@/lib/invoice/utils";
import { ExternalLink } from "lucide-react";

export function Form() {
  const { invoiceId, setParams } = useInvoiceParams();
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();
  const [lastEditedText, setLastEditedText] = useState("");

  const form = useFormContext();
  const token = form.watch("token");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const draftInvoiceMutation = useMutation(
    trpc.invoice.draft.mutationOptions({
      onSuccess: (data) => {
        if (!invoiceId && data?.id) {
          setParams({ type: "edit", invoiceId: data.id });
        }

        setLastUpdated(new Date());

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.infiniteQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.invoiceSummary.queryKey(),
        });
      },
    })
  );

  const createInvoiceMutation = useMutation(
    trpc.invoice.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoice.get.infiniteQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.getById.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.invoice.invoiceSummary.queryKey(),
        });

        // Invalidate global search
        queryClient.invalidateQueries({
          queryKey: trpc.search.global.queryKey(),
        });

        setParams({ type: "success", invoiceId: data.id });
      },
    })
  );

  // Only watch the fields that are used in the upsert action
  const formValues = useWatch({
    control: form.control,
    name: [
      "customerDetails",
      "customerId",
      "customerName",
      "template",
      "lineItems",
      "amount",
      "vat",
      "tax",
      "discount",
      "dueDate",
      "issueDate",
      "noteDetails",
      "paymentDetails",
      "fromDetails",
      "invoiceNumber",
      "topBlock",
      "bottomBlock",
    ],
  });

  const isDirty = form.formState.isDirty;
  const invoiceNumberValid = !form.getFieldState("invoiceNumber").error;
  const [debouncedValue] = useDebounceValue(formValues, 500);

  useEffect(() => {
    if (isDirty && form.watch("customerId") && invoiceNumberValid) {
      const currentFormValues = form.getValues();
      draftInvoiceMutation.mutate(
        // @ts-expect-error
        transformFormValuesToDraft(currentFormValues)
      );
    }
  }, [debouncedValue, isDirty, invoiceNumberValid]);

  useEffect(() => {
    const updateLastEditedText = () => {
      if (!lastUpdated) {
        setLastEditedText("");
        return;
      }

      setLastEditedText(`Edited ${formatRelativeTime(lastUpdated)}`);
    };

    updateLastEditedText();
    const intervalId = setInterval(updateLastEditedText, 1000);

    return () => clearInterval(intervalId);
  }, [lastUpdated]);

  // Submit the form and the draft invoice
  const handleSubmit = (values: InvoiceFormValues) => {
    createInvoiceMutation.mutate({
      id: values.id,
      deliveryType: values.template.deliveryType ?? "create",
    });
  };

  // Prevent form from submitting when pressing enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <form
      // @ts-expect-error
      onSubmit={form.handleSubmit(handleSubmit)}
      className="relative h-full"
      onKeyDown={handleKeyDown}
    >
      <ScrollArea className="h-[calc(100vh-200px)] bg-background" hideScrollbar>
        <div className="p-8 pb-4 h-full flex flex-col">
          <div className="flex justify-between">
            <Meta />
            <Logo />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8 mb-4">
            <div>
              <FromDetails />
            </div>
            <div>
              <CustomerDetails />
            </div>
          </div>

          <EditBlock name="topBlock" />

          <div className="mt-4">
            <LineItems />
          </div>

          <div className="mt-12 flex justify-end mb-8">
            <Summary />
          </div>

          <div className="flex flex-col mt-auto">
            <div className="grid grid-cols-2 gap-6 mb-4 overflow-hidden">
              <PaymentDetails />
              <NoteDetails />
            </div>

            <EditBlock name="bottomBlock" />
          </div>
        </div>
      </ScrollArea>

      <div className="absolute bottom-14 w-full h-9">
        <div className="flex justify-between items-center mt-auto">
          <div className="flex space-x-2 items-center text-xs text-[#808080]">
            {token && (
              <>
                <OpenURL
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${token}`}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="size-3" />
                  <span>Preview invoice</span>
                </OpenURL>

                {(draftInvoiceMutation.isPending || lastEditedText) && (
                  <span>-</span>
                )}
              </>
            )}

            {(draftInvoiceMutation.isPending || lastEditedText) && (
              <span>
                {draftInvoiceMutation.isPending ? "Saving" : lastEditedText}
              </span>
            )}
          </div>

          <SubmitButton
            isSubmitting={createInvoiceMutation.isPending}
            disabled={
              createInvoiceMutation.isPending || draftInvoiceMutation.isPending
            }
          />
        </div>
      </div>
    </form>
  );
}
