import { ScrollArea } from "@/components/ui/scroll-area";
import { EditorContent } from "@/components/invoice/public/EditorContent";
import { Logo } from "@/components/invoice/public/Logo";
import { Meta } from "@/components/invoice/public/Meta";
import { Summary } from "@/components/invoice/public/Summary";
import { FunctionReturnType } from "convex/server";
import { api } from "../../../../convex/_generated/api";
import { LineItems } from "./LineItems";

type Props = {
  data: FunctionReturnType<typeof api.invoices.getInvoiceByToken>;
  width: number;
  height: number;
};

export function HtmlTemplate({ data, width, height }: Props) {
  if (!data) {
    return null;
  }

  const {
    invoiceNumber,
    issueDate,
    dueDate,
    template,
    lineItems,
    customerDetails,
    fromDetails,
    paymentDetails,
    noteDetails,
    currency,
    discount,
    customerName,
    topBlock,
    bottomBlock,
  } = data;

  return (
    <ScrollArea
      className="bg-background border border-border w-full md:w-auto h-full [&>div]:h-full"
      style={{
        width: "100%",
        maxWidth: width,
        height,
      }}
      hideScrollbar
    >
      <div
        className="p-4 sm:p-6 md:p-8 h-full flex flex-col"
        style={{ minHeight: height - 5 }}
      >
        <div className="flex justify-between">
          <Meta
            template={template}
            invoiceNumber={invoiceNumber ?? null}
            issueDate={issueDate}
            dueDate={dueDate}
          />

          {template.logoUrl && (
            <Logo logo={template.logoUrl} customerName={customerName || ""} />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 mb-4">
          <div>
            <p className="text-[11px] text-[#878787] font-mono mb-2 block">
              {template.fromLabel}
            </p>
            <EditorContent content={fromDetails} />
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-[11px] text-[#878787] font-mono mb-2 block">
              {template.customerLabel}
            </p>
            <EditorContent content={customerDetails} />
          </div>
        </div>

        <EditorContent content={topBlock} />

        <LineItems
          lineItems={lineItems}
          currency={currency ?? null}
          descriptionLabel={template.descriptionLabel}
          quantityLabel={template.quantityLabel}
          priceLabel={template.priceLabel}
          totalLabel={template.totalLabel}
          includeDecimals={template.includeDecimals}
          locale={template.locale}
          includeUnits={template.includeUnits}
        />

        <div className="mt-10 md:mt-12 flex justify-end mb-6 md:mb-8">
          <Summary
            includeVat={template.includeVat}
            includeTax={template.includeTax}
            taxRate={template.taxRate}
            vatRate={template.vatRate}
            currency={currency ?? null}
            vatLabel={template.vatLabel}
            taxLabel={template.taxLabel}
            totalLabel={template.totalSummaryLabel}
            lineItems={lineItems}
            includeDiscount={template.includeDiscount}
            discountLabel={template.discountLabel}
            discount={discount}
            locale={template.locale}
            includeDecimals={template.includeDecimals}
            subtotalLabel={template.subtotalLabel}
          />
        </div>

        <div className="flex flex-col space-y-6 md:space-y-8 mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {paymentDetails ? (
              <div>
                <p className="text-[11px] text-[#878787] font-mono mb-2 block">
                  {template.paymentLabel}
                </p>
                <EditorContent content={paymentDetails} />
              </div>
            ) : null}
            {noteDetails ? (
              <div className="mt-4 md:mt-0">
                <p className="text-[11px] text-[#878787] font-mono mb-2 block">
                  {template.noteLabel}
                </p>
                <EditorContent content={noteDetails} />
              </div>
            ) : null}
          </div>

          <EditorContent content={bottomBlock} />
        </div>
      </div>
    </ScrollArea>
  );
}
