import { Header } from "@/components/dashboard/common/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <Sidebar />

      <div className="md:ml-[70px] pb-8">
        <Header />
        <div className="p-6">{children}</div>
      </div>

      {/* <ExportStatus /> */}

      {/* <Suspense>
        <GlobalSheets
          currencyPromise={currencyPromise}
          countryCodePromise={countryCodePromise}
        />
      </Suspense> */}
    </div>
  );
};

export default layout;
