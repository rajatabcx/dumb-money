import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./useHelper";

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
    dateFormat: v.optional(
      v.union(
        v.literal("dd/MM/yyyy"),
        v.literal("MM/dd/yyyy"),
        v.literal("yyyy-MM-dd"),
        v.literal("dd.MM.yyyy")
      )
    ),
    timezone: v.optional(v.string()),
    companyId: v.optional(v.id("company")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

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
  args: {},
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      isOnboarded: true,
    });
  },
});

export const currentUser = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user;
  },
});
