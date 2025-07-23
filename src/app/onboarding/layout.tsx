import React from "react";
import { api } from "../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { invoiceRoute } from "@/lib/routeHelpers";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (user?.isOnboarded) {
    return redirect(invoiceRoute());
  }

  return <div>{children}</div>;
}
