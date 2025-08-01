import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import {
  generateToken,
  getInvoiceTemplate,
  getNextInvoiceNumber,
} from "./invoiceHelper";
import { getCurrentUser } from "./useHelper";
import { UTCDate } from "@date-fns/utc";
import { addMonths } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Id } from "./_generated/dataModel";

export function parseInputValue(value?: string | null) {
  if (value === null) return null;
  return value ? JSON.parse(value) : undefined;
}

export type UpdateInvoiceParams = {
  id: Id<"invoices">;
  status?: "paid" | "canceled" | "unpaid";
  paidAt?: string;
  internalNote?: string;
  reminderSentAt?: string;
  storageId?: Id<"_storage">;
};

export async function updateInvoiceHelper(
  ctx: MutationCtx,
  params: UpdateInvoiceParams
) {
  const { id, ...rest } = params;

  const invoice = await ctx.db.get(id);
  if (!invoice) {
    throw new ConvexError("Invoice not found");
  }

  return await ctx.db.patch(id, {
    ...invoice,
    ...rest,
    updatedAt: new Date().toISOString(),
  });
}

const defaultTemplate = {
  title: "Invoice",
  customerLabel: "To",
  fromLabel: "From",
  invoiceNoLabel: "Invoice No",
  issueDateLabel: "Issue Date",
  dueDateLabel: "Due Date",
  descriptionLabel: "Description",
  priceLabel: "Price",
  quantityLabel: "Quantity",
  totalLabel: "Total",
  totalSummaryLabel: "Total",
  subtotalLabel: "Subtotal",
  vatLabel: "VAT",
  taxLabel: "Tax",
  paymentLabel: "Payment Details",
  paymentDetails: undefined,
  noteLabel: "Note",
  logoUrl: undefined,
  currency: "USD",
  fromDetails: undefined,
  size: "a4" as const,
  includeVat: true,
  includeTax: true,
  discountLabel: "Discount",
  includeDiscount: false,
  includeUnits: false,
  includeDecimals: false,
  includePdf: false,
  sendCopy: false,
  includeQr: true,
  dateFormat: "dd/MM/yyyy" as const,
  taxRate: 0,
  vatRate: 0,
  deliveryType: "create" as const,
  timezone: undefined,
  locale: undefined,
};

export const getCompanyInvoices = query({
  args: {
    companyId: v.id("company"),
    sort: v.optional(v.array(v.string())),
    q: v.optional(v.string()),
    statuses: v.optional(
      v.array(
        v.union(
          v.literal("draft"),
          v.literal("overdue"),
          v.literal("paid"),
          v.literal("unpaid"),
          v.literal("canceled")
        )
      )
    ),
    start: v.optional(v.string()),
    end: v.optional(v.string()),
    customers: v.optional(v.array(v.id("customers"))),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const {
      companyId,
      sort,
      q,
      statuses,
      start,
      end,
      customers,
      paginationOpts,
    } = args;

    // Start with base query filtered by company
    let query = ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", companyId));

    // Apply status filter
    if (statuses && statuses.length > 0) {
      query = query.filter((q) =>
        q.or(...statuses.map((status) => q.eq(q.field("status"), status)))
      );
    }

    // Apply customer filter
    if (customers && customers.length > 0) {
      query = query.filter((q) =>
        q.or(
          ...customers.map((customerId) =>
            q.eq(q.field("customerId"), customerId)
          )
        )
      );
    }

    // Apply date range filter (start and end are ISO strings, convert to timestamps)
    if (start && end) {
      const startTimestamp = new Date(start).getTime();
      const endTimestamp = new Date(end).getTime();

      query = query.filter((q) =>
        q.and(
          q.gte(q.field("dueDate"), startTimestamp),
          q.lte(q.field("dueDate"), endTimestamp)
        )
      );
    }

    // Apply search query filter
    if (q) {
      const searchQuery = q.toLowerCase().trim();

      // If the query is a number, search by amount
      if (!Number.isNaN(Number.parseInt(searchQuery))) {
        const searchAmount = Number(searchQuery);
        query = query.filter((q) => q.eq(q.field("amount"), searchAmount));
      } else {
        // Search by invoice number or customer name
        query = query.filter((q) =>
          q.or(
            q.eq(q.field("invoiceNumber"), searchQuery),
            q.eq(q.field("customerName"), searchQuery)
          )
        );
      }
    }

    // Get all matching invoices first
    const allInvoices = await query.paginate(paginationOpts);

    // Get customer and company data for joins
    const customerPromises = allInvoices.page.map(async (invoice) => {
      if (invoice.customerId) {
        return ctx.db.get(invoice.customerId);
      }
      return null;
    });

    const companyPromise = ctx.db.get(companyId);

    const [invoiceCustomers, company] = await Promise.all([
      Promise.all(customerPromises),
      companyPromise,
    ]);

    // Combine invoice data with joined data
    const enrichedInvoices = allInvoices.page.map((invoice, index) => ({
      id: invoice._id,
      dueDate: invoice.dueDate,
      invoiceNumber: invoice.invoiceNumber,
      createdAt: invoice._creationTime,
      amount: invoice.amount,
      currency: invoice.currency,
      lineItems: invoice.lineItems,
      paymentDetails: invoice.paymentDetails,
      customerDetails: invoice.customerDetails,
      reminderSentAt: invoice.reminderSentAt,
      updatedAt: invoice.updatedAt,
      note: invoice.note,
      internalNote: invoice.internalNote,
      paidAt: invoice.paidAt,
      vat: invoice.vat,
      tax: invoice.tax,
      filePath: invoice.filePath,
      status: invoice.status,
      viewedAt: invoice.viewedAt,
      fromDetails: invoice.fromDetails,
      issueDate: invoice.issueDate,
      sentAt: invoice.sentAt,
      template: invoice.template,
      noteDetails: invoice.noteDetails,
      customerName: invoice.customerName,
      token: invoice.token,
      sentTo: invoice.sentTo,
      discount: invoice.discount,
      subtotal: invoice.subtotal,
      topBlock: invoice.topBlock,
      bottomBlock: invoice.bottomBlock,
      customer: invoiceCustomers[index]
        ? {
            id: invoiceCustomers[index]!._id,
            name: invoiceCustomers[index]!.name,
            website: invoiceCustomers[index]!.website,
            email: invoiceCustomers[index]!.email,
          }
        : null,
      customerId: invoice.customerId,
      team: company
        ? {
            name: company.name,
          }
        : null,
      storageId: invoice.storageId,
      companyId: invoice.companyId,
    }));

    // Apply sorting
    if (sort && sort.length === 2) {
      const [column, direction] = sort;
      const isAscending = direction === "asc";

      enrichedInvoices.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (column) {
          case "customer":
            aValue = a.customer?.name || "";
            bValue = b.customer?.name || "";
            break;
          case "created_at":
            aValue = a.createdAt || 0;
            bValue = b.createdAt || 0;
            break;
          case "due_date":
            aValue = a.dueDate || 0;
            bValue = b.dueDate || 0;
            break;
          case "amount":
            aValue = a.amount || 0;
            bValue = b.amount || 0;
            break;
          case "status":
            aValue = a.status || "";
            bValue = b.status || "";
            break;
          default:
            aValue = a.createdAt || 0;
            bValue = b.createdAt || 0;
        }

        if (aValue < bValue) return isAscending ? -1 : 1;
        if (aValue > bValue) return isAscending ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by created_at descending
      enrichedInvoices.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return { ...allInvoices, page: enrichedInvoices };
  },
});

export const invoiceSummary = query({
  args: {
    companyId: v.id("company"),
    status: v.union(
      v.literal("draft"),
      v.literal("overdue"),
      v.literal("paid"),
      v.literal("unpaid"),
      v.literal("canceled")
    ),
  },
  handler: async (ctx, args) => {
    const { companyId, status } = args;

    const query = ctx.db
      .query("invoices")
      .withSearchIndex("summary", (q) =>
        q.search("status", status).eq("companyId", companyId)
      );

    const invoices = await query.collect();

    // Group by currency and aggregate
    const currencyGroups: Record<
      string,
      { totalAmount: number; invoiceCount: number }
    > = {};

    invoices.forEach((invoice) => {
      const currency = invoice.currency || "USD"; // Default to USD if no currency
      const amount = invoice.amount || 0;

      if (!currencyGroups[currency]) {
        currencyGroups[currency] = {
          totalAmount: 0,
          invoiceCount: 0,
        };
      }

      currencyGroups[currency].totalAmount += amount;
      currencyGroups[currency].invoiceCount += 1;
    });

    // Convert to array format
    const result = Object.entries(currencyGroups).map(([currency, data]) => ({
      currency,
      totalAmount: data.totalAmount,
      invoiceCount: data.invoiceCount,
    }));

    // Sort by totalAmount descending (optional)
    result.sort((a, b) => b.totalAmount - a.totalAmount);

    return result;
  },
});

export const defaultSettings = query({
  args: {
    companyId: v.id("company"),
  },
  handler: async (ctx, args) => {
    const { companyId } = args;
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }
    const nextInvoiceNumber = await getNextInvoiceNumber(ctx, companyId);
    const template = await getInvoiceTemplate(ctx, companyId);
    const company = await ctx.db.get(companyId);

    const locale = user?.locale ?? "en";
    const timezone = user?.timezone ?? "America/New_York";
    const currency =
      template?.currency ?? company?.baseCurrency ?? defaultTemplate.currency;
    const dateFormat =
      template?.dateFormat ?? user?.dateFormat ?? defaultTemplate.dateFormat;
    const logoUrl = template?.logoUrl ?? defaultTemplate.logoUrl;
    const countryCode = company?.countryCode ?? "US";

    const size = ["US", "CA"].includes(countryCode)
      ? ("letter" as const)
      : ("a4" as const);
    const includeTax = ["US", "CA", "AU", "NZ", "SG", "MY", "IN"].includes(
      countryCode
    );

    const savedTemplate = {
      title: template?.title ?? defaultTemplate.title,
      logoUrl,
      currency,
      size: template?.size ?? defaultTemplate.size,
      includeTax: template?.includeTax ?? includeTax,
      includeVat: template?.includeVat ?? !includeTax,
      includeDiscount:
        template?.includeDiscount ?? defaultTemplate.includeDiscount,
      includeDecimals:
        template?.includeDecimals ?? defaultTemplate.includeDecimals,
      includeUnits: template?.includeUnits ?? defaultTemplate.includeUnits,
      includeQr: template?.includeQr ?? defaultTemplate.includeQr,
      includePdf: template?.includePdf ?? defaultTemplate.includePdf,
      sendCopy: template?.sendCopy ?? defaultTemplate.sendCopy,
      customerLabel: template?.customerLabel ?? defaultTemplate.customerLabel,
      fromLabel: template?.fromLabel ?? defaultTemplate.fromLabel,
      invoiceNoLabel:
        template?.invoiceNoLabel ?? defaultTemplate.invoiceNoLabel,
      subtotalLabel: template?.subtotalLabel ?? defaultTemplate.subtotalLabel,
      issueDateLabel:
        template?.issueDateLabel ?? defaultTemplate.issueDateLabel,
      dueDateLabel: template?.dueDateLabel ?? defaultTemplate.dueDateLabel,
      discountLabel: template?.discountLabel ?? defaultTemplate.discountLabel,
      descriptionLabel:
        template?.descriptionLabel ?? defaultTemplate.descriptionLabel,
      priceLabel: template?.priceLabel ?? defaultTemplate.priceLabel,
      quantityLabel: template?.quantityLabel ?? defaultTemplate.quantityLabel,
      totalLabel: template?.totalLabel ?? defaultTemplate.totalLabel,
      vatLabel: template?.vatLabel ?? defaultTemplate.vatLabel,
      taxLabel: template?.taxLabel ?? defaultTemplate.taxLabel,
      paymentLabel: template?.paymentLabel ?? defaultTemplate.paymentLabel,
      noteLabel: template?.noteLabel ?? defaultTemplate.noteLabel,
      dateFormat,
      deliveryType: template?.deliveryType ?? defaultTemplate.deliveryType,
      taxRate: template?.taxRate ?? defaultTemplate.taxRate,
      vatRate: template?.vatRate ?? defaultTemplate.vatRate,
      fromDetails: template?.fromDetails ?? defaultTemplate.fromDetails,
      paymentDetails:
        template?.paymentDetails ?? defaultTemplate.paymentDetails,
      timezone,
      locale,
    };

    return {
      id: uuidv4(),
      currency,
      status: "draft",
      size,
      includeTax: savedTemplate?.includeTax ?? includeTax,
      includeVat: savedTemplate?.includeVat ?? !includeTax,
      includeDiscount: false,
      includeDecimals: false,
      includePdf: false,
      sendCopy: false,
      includeUnits: false,
      includeQr: true,
      invoiceNumber: nextInvoiceNumber,
      timezone,
      locale,
      fromDetails: savedTemplate.fromDetails,
      paymentDetails: savedTemplate.paymentDetails,
      customerDetails: undefined,
      noteDetails: undefined,
      customerId: undefined,
      issueDate: new UTCDate().toISOString(),
      dueDate: addMonths(new UTCDate(), 1).toISOString(),
      lineItems: [{ name: "", quantity: 0, price: 0, vat: 0 }],
      tax: undefined,
      token: undefined,
      discount: undefined,
      subtotal: undefined,
      topBlock: undefined,
      bottomBlock: undefined,
      amount: undefined,
      customerName: undefined,
      logoUrl: undefined,
      vat: undefined,
      template: savedTemplate,
    };
  },
});

export const getInvoice = query({
  args: {
    id: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const invoice = await ctx.db.get(id);

    if (!invoice) {
      return null;
    }
    const customer = invoice.customerId
      ? await ctx.db.get(invoice.customerId)
      : null;

    return {
      ...invoice,
      customer,
    };
  },
});

export const upsertTemplate = mutation({
  args: {
    companyId: v.id("company"),
    template: v.object({
      customerLabel: v.optional(v.string()),
      title: v.optional(v.string()),
      fromLabel: v.optional(v.string()),
      invoiceNoLabel: v.optional(v.string()),
      issueDateLabel: v.optional(v.string()),
      dueDateLabel: v.optional(v.string()),
      descriptionLabel: v.optional(v.string()),
      priceLabel: v.optional(v.string()),
      quantityLabel: v.optional(v.string()),
      totalLabel: v.optional(v.string()),
      totalSummaryLabel: v.optional(v.string()),
      vatLabel: v.optional(v.string()),
      subtotalLabel: v.optional(v.string()),
      taxLabel: v.optional(v.string()),
      discountLabel: v.optional(v.string()),
      timezone: v.optional(v.string()),
      paymentLabel: v.optional(v.string()),
      noteLabel: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      currency: v.optional(v.string()),
      paymentDetails: v.optional(v.string()),
      fromDetails: v.optional(v.string()),
      dateFormat: v.optional(
        v.union(
          v.literal("dd/MM/yyyy"),
          v.literal("MM/dd/yyyy"),
          v.literal("yyyy-MM-dd"),
          v.literal("dd.MM.yyyy")
        )
      ),
      includeVat: v.optional(v.boolean()),
      includeTax: v.optional(v.boolean()),
      includeDiscount: v.optional(v.boolean()),
      includeDecimals: v.optional(v.boolean()),
      includePdf: v.optional(v.boolean()),
      sendCopy: v.optional(v.boolean()),
      includeUnits: v.optional(v.boolean()),
      includeQr: v.optional(v.boolean()),
      taxRate: v.optional(v.number()),
      vatRate: v.optional(v.number()),
      size: v.optional(v.union(v.literal("a4"), v.literal("letter"))),
      deliveryType: v.optional(
        v.union(v.literal("create"), v.literal("create_and_send"))
      ),
      locale: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { companyId, template } = args;
    const fromDetails = parseInputValue(template.fromDetails);
    const paymentDetails = parseInputValue(template.paymentDetails);

    const templateForCompany = await ctx.db
      .query("invoiceTemplates")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .first();

    if (!templateForCompany) {
      return await ctx.db.insert("invoiceTemplates", {
        ...template,
        fromDetails: fromDetails,
        paymentDetails: paymentDetails,
        companyId,
        size: "a4",
        deliveryType: "create",
      });
    }

    return await ctx.db.patch(templateForCompany._id, {
      ...templateForCompany,
      ...template,
      fromDetails: fromDetails,
      paymentDetails: paymentDetails,
    });
  },
});

export const draft = mutation({
  args: {
    companyId: v.id("company"),
    invoiceId: v.optional(v.id("invoices")),
    id: v.string(),
    template: v.object({
      title: v.optional(v.string()),
      customerLabel: v.string(),
      fromLabel: v.string(),
      invoiceNoLabel: v.string(),
      issueDateLabel: v.string(),
      dueDateLabel: v.string(),
      descriptionLabel: v.string(),
      priceLabel: v.string(),
      quantityLabel: v.string(),
      totalLabel: v.string(),
      totalSummaryLabel: v.optional(v.string()),
      vatLabel: v.optional(v.string()),
      taxLabel: v.optional(v.string()),
      paymentLabel: v.string(),
      noteLabel: v.string(),
      logoUrl: v.optional(v.string()),
      currency: v.string(),
      paymentDetails: v.optional(v.any()),
      fromDetails: v.optional(v.any()),
      size: v.union(v.literal("a4"), v.literal("letter")),
      includeVat: v.optional(v.boolean()),
      includeTax: v.optional(v.boolean()),
      includeDiscount: v.optional(v.boolean()),
      includeDecimals: v.optional(v.boolean()),
      includePdf: v.optional(v.boolean()),
      includeUnits: v.optional(v.boolean()),
      includeQr: v.optional(v.boolean()),
      taxRate: v.optional(v.number()),
      vatRate: v.optional(v.number()),
      dateFormat: v.union(
        v.literal("dd/MM/yyyy"),
        v.literal("MM/dd/yyyy"),
        v.literal("yyyy-MM-dd"),
        v.literal("dd.MM.yyyy")
      ),
      deliveryType: v.union(v.literal("create"), v.literal("create_and_send")),
      locale: v.optional(v.string()),
      timezone: v.optional(v.string()),
      discountLabel: v.optional(v.string()),
      subtotalLabel: v.optional(v.string()),
      sendCopy: v.optional(v.boolean()),
    }),
    fromDetails: v.optional(v.string()),
    customerDetails: v.optional(v.string()),
    customerId: v.optional(v.id("customers")),
    customerName: v.optional(v.string()),
    paymentDetails: v.optional(v.string()),
    noteDetails: v.optional(v.string()),
    dueDate: v.string(),
    issueDate: v.string(),
    invoiceNumber: v.string(),
    logoUrl: v.optional(v.string()),
    vat: v.optional(v.number()),
    tax: v.optional(v.number()),
    discount: v.optional(v.number()),
    subtotal: v.optional(v.number()),
    topBlock: v.optional(v.any()),
    bottomBlock: v.optional(v.any()),
    amount: v.optional(v.number()),
    lineItems: v.optional(
      v.array(
        v.object({
          name: v.string(),
          quantity: v.number(),
          unit: v.optional(v.string()),
          price: v.number(),
          vat: v.optional(v.number()),
          tax: v.optional(v.number()),
        })
      )
    ),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const {
      companyId,
      invoiceId,
      paymentDetails,
      fromDetails,
      customerDetails,
      noteDetails,
      ...input
    } = args;

    const modifiedPaymentDetails = parseInputValue(paymentDetails);
    const modifiedFromDetails = parseInputValue(fromDetails);
    const modifiedCustomerDetails = parseInputValue(customerDetails);
    const modifiedNoteDetails = parseInputValue(noteDetails);
    const useToken = input.token ?? (await generateToken(input.id));
    const {
      paymentDetails: _,
      fromDetails: __,
      ...restTemplate
    } = input.template;

    const invoice = invoiceId
      ? await ctx.db.patch(invoiceId, {
          companyId,
          token: useToken,
          ...input,
          template: restTemplate,
          paymentDetails: modifiedPaymentDetails,
          fromDetails: modifiedFromDetails,
          customerDetails: modifiedCustomerDetails,
          noteDetails: modifiedNoteDetails,
          currency: input.template.currency?.toUpperCase(),
          updatedAt: new Date().toISOString(),
        })
      : await ctx.db.insert("invoices", {
          companyId,
          token: useToken,
          ...input,
          template: restTemplate,
          paymentDetails: modifiedPaymentDetails,
          fromDetails: modifiedFromDetails,
          customerDetails: modifiedCustomerDetails,
          noteDetails: modifiedNoteDetails,
          currency: input.template.currency?.toUpperCase(),
          updatedAt: new Date().toISOString(),
          status: "draft",
        });

    return invoice;
  },
});

export const create = mutation({
  args: {
    companyId: v.id("company"),
    invoiceId: v.id("invoices"),
    deliveryType: v.union(v.literal("create"), v.literal("create_and_send")),
  },
  handler: async (ctx, args) => {
    const { companyId, invoiceId, deliveryType } = args;

    await updateInvoiceHelper(ctx, {
      id: invoiceId,
      status: "unpaid",
    });

    // await tasks.trigger("generate-invoice", {
    //   invoiceId: data.id,
    //   deliveryType: input.deliveryType,
    // } satisfies GenerateInvoicePayload);

    return invoiceId;
  },
});

export const updateInvoice = mutation({
  args: {
    id: v.id("invoices"),
    status: v.optional(
      v.union(v.literal("paid"), v.literal("canceled"), v.literal("unpaid"))
    ),
    paidAt: v.optional(v.string()),
    internalNote: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, status, paidAt, internalNote, storageId } = args;

    const patch: {
      status?: "paid" | "canceled" | "unpaid";
      paidAt?: string;
      internalNote?: string;
      storageId?: Id<"_storage">;
    } = {};

    if (status !== undefined) patch.status = status;
    if (paidAt !== undefined) patch.paidAt = paidAt;
    if (internalNote !== undefined) patch.internalNote = internalNote;
    if (storageId !== undefined) patch.storageId = storageId;

    return await updateInvoiceHelper(ctx, {
      id,
      ...patch,
    });
  },
});

export const searchInvoiceNumber = query({
  args: {
    companyId: v.id("company"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const { companyId, query } = args;
    const result = await ctx.db
      .query("invoices")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), companyId),
          q.eq(q.field("invoiceNumber"), query)
        )
      )
      .first();

    return result;
  },
});

export const deleteInvoice = mutation({
  args: {
    id: v.id("invoices"),
    companyId: v.id("company"),
  },
  handler: async (ctx, args) => {
    const { id, companyId } = args;
    const invoice = await ctx.db.get(id);

    if (!invoice || invoice.companyId !== companyId) {
      throw new Error("Invoice not found");
    }

    if (invoice.status !== "draft" && invoice.status !== "canceled") {
      throw new Error("Can only delete draft or canceled invoices");
    }

    await ctx.db.delete(id);
  },
});

export const sendReminder = mutation({
  args: {
    id: v.id("invoices"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, date } = args;

    return await updateInvoiceHelper(ctx, {
      id,
      reminderSentAt: date,
    });
  },
});

export const getInvoiceByToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const { token } = args;

    const invoice = await ctx.db
      .query("invoices")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!invoice) {
      return null;
    }

    const customer = invoice.customerId
      ? await ctx.db.get(invoice.customerId)
      : null;

    const company = invoice.companyId
      ? await ctx.db.get(invoice.companyId)
      : null;

    return {
      ...invoice,
      customer,
      company,
    };
  },
});
