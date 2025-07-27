import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

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
