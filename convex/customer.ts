import { v } from "convex/values";
import { query } from "./_generated/server";

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
