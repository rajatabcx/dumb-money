// convex/userHelpers.ts
import { QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export async function getCurrentUser(
  ctx: QueryCtx
): Promise<Doc<"users"> | null> {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    return null;
  }
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.subject))
    .first();
}
