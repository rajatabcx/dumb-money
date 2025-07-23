import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { getCurrentUser } from "./useHelper";

export const create = mutation({
  args: {
    name: v.string(),
    countryCode: v.string(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const { name, countryCode, currency } = args;

    const companyId = await ctx.db.insert("company", {
      name,
      countryCode,
      baseCurrency: currency,
    });

    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      companyId,
    });

    return companyId;
  },
});

export const update = mutation({
  args: {
    id: v.id("company"),
    name: v.string(),
    countryCode: v.string(),
    baseCurrency: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, name, countryCode, baseCurrency } = args;

    const company = await ctx.db.patch(id, {
      name,
      countryCode,
      baseCurrency,
    });

    return company;
  },
});

export const get = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user || !user.companyId) {
      return null;
    }

    return await ctx.db.get(user.companyId);
  },
});
