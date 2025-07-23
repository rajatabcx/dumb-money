import { NextRequest, NextResponse } from "next/server";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { invoiceRoute, onboardingRoute } from "@/lib/routeHelpers";

export async function GET(request: NextRequest) {
  const user = await currentUser();
  const searchParams = new URL(request.url).searchParams;
  const redirectUrl = searchParams.get("redirect_url");
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const convexUser = await fetchQuery(api.user.currentUser, {});
  // if user is onboarded, redirect to invoice route
  if (!!convexUser && convexUser.isOnboarded) {
    return NextResponse.redirect(
      new URL(redirectUrl ?? invoiceRoute(), request.url)
    );
  }

  // if user is not onboarded, redirect to onboarding route
  const token = await getAuthToken();
  await fetchMutation(
    api.user.upsertUser,
    {
      clerkId: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      profileImage: user.imageUrl ?? "",
      visitorId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
    },
    { token }
  );

  return NextResponse.redirect(new URL(onboardingRoute(), request.url));
}
