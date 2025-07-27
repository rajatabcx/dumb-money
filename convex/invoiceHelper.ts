import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

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
  const nextNumber = (totalInvoices + 1).toString().padStart(2, "0");

  return `INV-${nextNumber}`;
}
