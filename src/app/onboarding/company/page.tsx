import { CreateCompanyForm } from "@/components/forms/CreateCompanyForm";
import { getCountryCode, getCurrency } from "@/lib/location";
import { LayoutDashboard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Company | Dumb Money",
};

export default function CreateTeam() {
  const currency = getCurrency();
  const countryCode = getCountryCode();

  return (
    <>
      <header className="w-full absolute left-0 right-0 flex justify-between items-center">
        <div className="ml-5 mt-4 md:ml-10 md:mt-10">
          <Link href="/">
            <LayoutDashboard />
          </Link>
        </div>
      </header>

      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[400px] flex-col">
          <div className="text-center">
            <h1 className="text-lg mb-2">Setup your team</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Add your logo, company name, country and currency. We&apos;ll use
              this to personalize your experience in Midday.
            </p>
          </div>

          <CreateCompanyForm
            defaultCurrencyPromise={currency}
            defaultCountryCodePromise={countryCode}
          />
        </div>
      </div>
    </>
  );
}
