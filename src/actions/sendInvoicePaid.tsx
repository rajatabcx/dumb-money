"use server";
import { getAuthToken } from "@/lib/auth";
import { resend } from "@/lib/resend/resend";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { encrypt } from "@/lib/encrypt";
import { nanoid } from "nanoid";
import InvoicePaidEmail from "@/components/invoice/emails/InvoicePaid";

export const sendInvoicePaidEmail = async (invoiceId: Id<"invoices">) => {
  const token = await getAuthToken();
  const invoiceData = await fetchQuery(
    api.invoices.getInvoice,
    {
      id: invoiceId,
    },
    { token }
  );

  if (!invoiceData) {
    console.error("Invoice not found");
    return;
  }

  const customerEmail = invoiceData?.customer?.email;

  if (!customerEmail) {
    console.error("Invoice customer email not found");
    return;
  }

  const response = await resend.emails.send({
    from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
    to: customerEmail,
    replyTo: invoiceData?.user?.email ?? undefined,
    subject: `Invoice #${invoiceData?.invoiceNumber} has been paid`,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    react: (
      <InvoicePaidEmail
        link={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${encodeURIComponent(
          invoiceData?.token
        )}?viewer=${encodeURIComponent(encrypt(customerEmail))}`}
        invoiceNumber={invoiceData?.invoiceNumber!}
      />
    ),
  });

  if (response.error) {
    console.error("Invoice reminder email failed to send", {
      invoiceId,
      error: response.error,
    });

    throw new Error("Invoice reminder email failed to send");
  }

  console.log("Invoice reminder email sent");
};
