"use server";
import { headers } from "next/headers";
import flags from "@/lib/countries";
import { currencies } from "@/lib/currencies";

export async function getCountryCode() {
  const headersList = await headers();

  return headersList.get("x-vercel-ip-country") || "SE";
}

export async function getCountry() {
  const country = await getCountryCode();

  // Type guard to ensure country is a key of flags
  if (country && Object.prototype.hasOwnProperty.call(flags, country)) {
    return flags[country as keyof typeof flags];
  }

  return undefined;
}

export async function getCurrency() {
  const countryCode = await getCountryCode();

  return currencies[countryCode as keyof typeof currencies];
}
