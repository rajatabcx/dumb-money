import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    profileImage: v.optional(v.string()),
    visitorId: v.string(),
    email: v.string(),
    locale: v.optional(v.string()),
    weekStartsOnMonday: v.optional(v.boolean()),
    timeFormat: v.optional(v.number()),
    dateFormat: v.optional(v.string()),
    timezone: v.optional(v.string()),
    companyId: v.optional(v.id("company")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        firstName: args.firstName,
        lastName: args.lastName,
        profileImage: args.profileImage,
        weekStartsOnMonday: args.weekStartsOnMonday ?? false,
        timeFormat: args.timeFormat ?? 24,
        dateFormat: args.dateFormat,
        timezone: args.timezone,
        companyId: args.companyId,
        email: args.email,
        locale: args.locale ?? "en",
      });
    } else {
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        firstName: args.firstName,
        lastName: args.lastName,
        profileImage: args.profileImage,
        visitorId: args.visitorId,
        isOnboarded: false,
        email: args.email,
        locale: args.locale ?? "en",
        weekStartsOnMonday: args.weekStartsOnMonday ?? false,
        timeFormat: args.timeFormat ?? 24,
      });
    }
  },
});

export const onboardUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isOnboarded: true,
    });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return null;
    }
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
      .first();
  },
});
