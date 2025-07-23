import { invoiceRoute } from "@/lib/routeHelpers";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Auth",
  description: "Auth",
};

export default async function AuthenticationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (user) {
    redirect(invoiceRoute());
  }
  return children;
}
