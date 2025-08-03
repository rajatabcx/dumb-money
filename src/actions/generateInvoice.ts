"use server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { PdfTemplate } from "@/components/invoice/pdf";
import { renderToBuffer } from "@react-pdf/renderer";
import { sendInvoiceEmail } from "./sendInvoice";

export const generateInvoice = async (
  invoiceId: Id<"invoices">,
  deliveryType: string
) => {
  const token = await getAuthToken();
  const invoiceData = await fetchQuery(
    api.invoices.getInvoice,
    {
      id: invoiceId,
    },
    { token }
  );

  if (!invoiceData) {
    console.error("Invoice not found", { invoiceId });
    return;
  }

  const buffer = await renderToBuffer(await PdfTemplate(invoiceData!));

  const filename = `${invoiceData?.invoiceNumber}.pdf`;

  if (invoiceData.storageId) {
    console.log("deleting existing invoice file", {
      storageId: invoiceData.storageId,
    });

    // if storageId is already set, delete it before uploading again
    await fetchMutation(api.file.deleteById, {
      storageId: invoiceData.storageId,
    });
  }

  console.log("uploading pdf to storage");

  const uploadUrl = await fetchMutation(
    api.file.generateUploadUrl,
    {},
    { token }
  );

  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: buffer,
  });

  const { storageId } = await result.json();

  await fetchMutation(api.invoices.updateInvoice, {
    id: invoiceId,
    storageId,
  });

  console.log("Invoice uploaded and updated with storageId", {
    invoiceId,
    storageId,
  });

  if (deliveryType === "create_and_send") {
    await sendInvoiceEmail(invoiceId);
  }

  console.log("Invoice generation completed", { invoiceId, filename });
};
