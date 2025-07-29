import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateToken } from "./invoiceHelper";

export const getAll = query({
  args: {
    q: v.optional(v.string()),
    companyId: v.id("company"),
  },
  handler: async (ctx, args) => {
    const { companyId, q } = args;

    const search = q?.toLocaleLowerCase().trim();

    return search
      ? await ctx.db
          .query("customers")
          .withSearchIndex("search", (q) =>
            q.search("name", search).eq("companyId", companyId)
          )
          .collect()
      : await ctx.db
          .query("customers")
          .withIndex("by_company", (q) => q.eq("companyId", companyId))
          .collect();
  },
});

export const getById = query({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    return await ctx.db.get(id);
  },
});

export const upsert = mutation({
  args: {
    customerId: v.optional(v.id("customers")),
    name: v.string(),
    email: v.string(),
    billingEmail: v.optional(v.string()),
    country: v.optional(v.string()),
    addressLine1: v.optional(v.string()),
    addressLine2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    note: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    countryCode: v.optional(v.string()),
    contact: v.optional(v.string()),
    companyId: v.id("company"),
  },
  handler: async (ctx, args) => {
    const {
      customerId,
      name,
      email,
      billingEmail,
      country,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      phone,
      website,
      note,
      vatNumber,
      countryCode,
      contact,
      companyId,
    } = args;

    if (customerId) {
      await ctx.db.patch(customerId, {
        name,
        email,
        billingEmail,
        country,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        phone,
        website,
        note,
        vatNumber,
        countryCode,
        contact,
        companyId,
      });
      return customerId;
    } else {
      return await ctx.db.insert("customers", {
        name,
        email,
        billingEmail,
        country,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        phone,
        website,
        note,
        vatNumber,
        countryCode,
        contact,
        companyId,
      });
    }
  },
});

export const deleteCustomer = mutation({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
  },
});
