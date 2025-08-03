"use server";
import { getAuthToken } from "@/lib/auth";
import { resend } from "@/lib/resend/resend";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { InvoiceEmail } from "@/components/invoice/emails/Invoice";
import { encrypt } from "@/lib/encrypt";
import { nanoid } from "nanoid";

export const sendInvoiceEmail = async (invoiceId: Id<"invoices">) => {
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
  const userEmail = invoiceData?.user?.email;

  const shouldSendCopy = invoiceData?.template?.sendCopy;

  const bcc = [
    ...(invoiceData?.customer?.billingEmail
      ? [invoiceData?.customer?.billingEmail]
      : []),
    ...(shouldSendCopy && userEmail ? [userEmail] : []),
  ];

  if (!customerEmail) {
    console.error("Invoice customer email not found");
    return;
  }

  const response = await resend.emails.send({
    from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
    to: customerEmail,
    bcc,
    replyTo: invoiceData?.user?.email ?? undefined,
    subject: `${invoiceData?.companyName} sent you an invoice`,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    // attachments,
    react: (
      <InvoiceEmail
        customerName={invoiceData?.customer?.name!}
        companyName={invoiceData?.companyName!}
        link={`${process.env.NEXT_PUBLIC_BASE_URL}/i/${encodeURIComponent(
          invoiceData?.token
        )}?viewer=${encodeURIComponent(encrypt(customerEmail))}`}
      />
    ),
  });

  if (response.error) {
    console.error("Invoice email failed to send", {
      invoiceId,
      error: response.error,
    });

    throw new Error("Invoice email failed to send");
  }

  console.log("Invoice email sent");

  await fetchMutation(api.invoices.updateInvoice, {
    id: invoiceId,
    status: "unpaid",
    sentTo: customerEmail,
    sentAt: new Date().toISOString(),
  });
};
