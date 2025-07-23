import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  company: defineTable({
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    baseCurrency: v.optional(v.string()),
    countryCode: v.optional(v.string()),
  }),

  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    firstName: v.string(),
    lastName: v.string(),
    profileImage: v.optional(v.string()),
    visitorId: v.string(),
    isOnboarded: v.boolean(),
    email: v.string(),
    locale: v.string(),
    weekStartsOnMonday: v.boolean(),
    timezone: v.optional(v.string()),
    timeFormat: v.number(),
    dateFormat: v.optional(v.string()),
    companyId: v.optional(v.id("company")),
  }).index("by_clerk_id", ["clerkId"]),

  customers: defineTable({
    name: v.string(),
    email: v.string(),
    billingEmail: v.optional(v.string()),
    country: v.optional(v.string()),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    note: v.optional(v.string()),
    companyId: v.id("company"), // Reference to company
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    token: v.string(),
    contact: v.optional(v.string()),
  }).index("by_company", ["companyId"]),

  invoiceTemplates: defineTable({
    companyId: v.id("company"), // Reference to company
    customerLabel: v.optional(v.string()),
    fromLabel: v.optional(v.string()),
    invoiceNoLabel: v.optional(v.string()),
    issueDateLabel: v.optional(v.string()),
    dueDateLabel: v.optional(v.string()),
    descriptionLabel: v.optional(v.string()),
    priceLabel: v.optional(v.string()),
    quantityLabel: v.optional(v.string()),
    totalLabel: v.optional(v.string()),
    vatLabel: v.optional(v.string()),
    taxLabel: v.optional(v.string()),
    paymentLabel: v.optional(v.string()),
    noteLabel: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    currency: v.optional(v.string()),
    paymentDetails: v.optional(v.any()), // JSON field
    fromDetails: v.optional(v.any()), // JSON field
    size: v.union(v.literal("a4"), v.literal("letter")),
    dateFormat: v.optional(v.string()),
    includeVat: v.optional(v.boolean()),
    includeTax: v.optional(v.boolean()),
    taxRate: v.optional(v.number()), // Numeric field
    deliveryType: v.union(
      v.literal("create"),
      v.literal("create_and_send"),
      v.literal("scheduled")
    ),
    discountLabel: v.optional(v.string()),
    includeDiscount: v.optional(v.boolean()),
    includeDecimals: v.optional(v.boolean()),
    includeQr: v.optional(v.boolean()),
    totalSummaryLabel: v.optional(v.string()),
    title: v.optional(v.string()),
    vatRate: v.optional(v.number()), // Numeric field
    includeUnits: v.optional(v.boolean()),
    subtotalLabel: v.optional(v.string()),
    includePdf: v.optional(v.boolean()),
    sendCopy: v.optional(v.boolean()),
  }).index("by_company", ["companyId"]),

  invoices: defineTable({
    companyId: v.id("company"), // Reference to company
    customerId: v.optional(v.id("customers")), // Reference to customer
    userId: v.optional(v.id("users")), // Reference to user
    updatedAt: v.optional(v.number()), // timestamp in milliseconds
    dueDate: v.optional(v.number()), // timestamp in milliseconds
    invoiceNumber: v.optional(v.string()),
    amount: v.optional(v.number()), // Numeric field
    currency: v.optional(v.string()),
    lineItems: v.optional(v.any()), // JSON field
    paymentDetails: v.optional(v.any()), // JSON field
    customerDetails: v.optional(v.any()), // JSON field
    companyDetails: v.optional(v.any()), // JSON field (fixed typo from companyDatails)
    note: v.optional(v.string()),
    internalNote: v.optional(v.string()),
    paidAt: v.optional(v.number()), // timestamp in milliseconds
    vat: v.optional(v.number()), // Numeric field
    tax: v.optional(v.number()), // Numeric field
    url: v.optional(v.string()),
    filePath: v.optional(v.array(v.string())), // Array of file paths
    status: v.union(
      v.literal("draft"),
      v.literal("overdue"),
      v.literal("paid"),
      v.literal("unpaid"),
      v.literal("canceled")
    ),
    viewedAt: v.optional(v.number()), // timestamp in milliseconds
    fromDetails: v.optional(v.any()), // JSON field
    issueDate: v.optional(v.number()), // timestamp in milliseconds
    template: v.optional(v.any()), // JSON field
    noteDetails: v.optional(v.any()), // JSON field
    customerName: v.optional(v.string()),
    token: v.string(),
    sentTo: v.optional(v.string()),
    reminderSentAt: v.optional(v.number()), // timestamp in milliseconds
    discount: v.optional(v.number()), // Numeric field
    fileSize: v.optional(v.number()), // Numeric field
    subtotal: v.optional(v.number()), // Numeric field
    topBlock: v.optional(v.any()), // JSON field
    bottomBlock: v.optional(v.any()), // JSON field
    sentAt: v.optional(v.number()), // timestamp in milliseconds
    scheduledAt: v.optional(v.number()), // timestamp in milliseconds
    scheduledJobId: v.optional(v.string()),
  })
    .index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_scheduled_job", ["scheduledJobId"]),
});
