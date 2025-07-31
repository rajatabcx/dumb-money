// import { getAuthToken } from "@/lib/auth";
// import { generateInvoiceSchema } from "@/lib/invoice/validationSchemas";
// import { schemaTask, logger } from "@trigger.dev/sdk/v3";
// import { fetchMutation, fetchQuery } from "convex/nextjs";
// import { api } from "../../../convex/_generated/api";
// import { Id } from "../../../convex/_generated/dataModel";
// import { PdfTemplate } from "@/components/invoice/pdf";
// import { renderToBuffer } from "@react-pdf/renderer";
// import { sendInvoiceEmail } from "../email/sendInvoice";

// export const generateInvoice = schemaTask({
//   id: "generate-invoice",
//   schema: generateInvoiceSchema,
//   maxDuration: 60,
//   queue: {
//     concurrencyLimit: 50,
//   },
//   machine: {
//     preset: "large-1x",
//   },
//   run: async (payload) => {
//     const invoiceId = payload.invoiceId as Id<"invoices">;
//     const token = await getAuthToken();
//     const invoiceData = await fetchQuery(
//       api.invoices.getInvoice,
//       {
//         id: invoiceId,
//       },
//       { token }
//     );

//     if (!invoiceData) {
//       logger.error("Invoice not found", { invoiceId });
//       return;
//     }

//     const buffer = await renderToBuffer(await PdfTemplate(invoiceData!));

//     const filename = `${invoiceData?.invoiceNumber}.pdf`;
//     const fullPath = `${invoiceData?.companyId}/invoices/${filename}`;

//     logger.debug("PDF uploaded to storage");

//     const uploadUrl = await fetchMutation(
//       api.file.generateUploadUrl,
//       {},
//       { token }
//     );

//     const result = await fetch(uploadUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/pdf" },
//       body: buffer,
//     });

//     const { storageId } = await result.json();

//     await fetchMutation(api.invoices.update, {
//       id: invoiceId,
//       storageId,
//     });

//     if (payload.deliveryType === "create_and_send") {
//       await sendInvoiceEmail.trigger({
//         invoiceId,
//         filename,
//         fullPath,
//       });
//     }

//     logger.info("Invoice generation completed", { invoiceId, filename });
//   },
// });
