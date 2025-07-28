import { Header } from "@/components/dashboard/common/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { fetchQuery } from "convex/nextjs";
import React, { Suspense } from "react";
import { api } from "../../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { onboardingRoute, storefrontRoute } from "@/lib/routeHelpers";
import { GlobalSheets } from "@/components/sheets/GlobalSheets";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getAuthToken();
  const user = await fetchQuery(api.user.currentUser, {}, { token });

  if (!user?.isOnboarded) {
    return redirect(onboardingRoute());
  }

  if (!user?.companyId) {
    return redirect(storefrontRoute());
  }

  return (
    <div className="relative">
      <Sidebar />

      <div className="md:ml-[70px] pb-8">
        <Header />
        <div className="p-6">{children}</div>
      </div>

      {/* <ExportStatus /> */}

      <Suspense>
        <GlobalSheets companyId={user.companyId} />
      </Suspense>
    </div>
  );
};

export default layout;
