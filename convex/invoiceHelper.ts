import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";
import * as jose from "jose";

export async function getNextInvoiceNumber(
  ctx: QueryCtx,
  companyId: Id<"company">
): Promise<string> {
  // Get total number of invoices for this company
  const invoices = await ctx.db
    .query("invoices")
    .withIndex("by_company", (q) => q.eq("companyId", companyId))
    .collect();

  const totalInvoices = invoices.length;

  // Add 1 to get next invoice number and pad with zeros
  const nextNumber = (totalInvoices + 1).toString().padStart(3, "0");

  return `INV-${nextNumber}`;
}

export async function getInvoiceTemplate(
  ctx: QueryCtx,
  companyId: Id<"company">
) {
  const template = await ctx.db
    .query("invoiceTemplates")
    .withIndex("by_company", (q) => q.eq("companyId", companyId))
    .first();

  return template;
}

export async function generateToken(id: string) {
  const secret = new TextEncoder().encode(process.env.INVOICE_JWT_SECRET);
  const token = await new jose.SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);

  return token;
}
