"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Props = {
  value: number;
  currency: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

export function AnimatedNumber({
  value,
  currency,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: Props) {
  const user = useQuery(api.user.currentUser);
  const localeToUse = locale || user?.locale;

  return (
    <NumberFlow
      value={value}
      format={{
        style: "currency",
        currency: currency ?? "USD",
        minimumFractionDigits,
        maximumFractionDigits,
      }}
      willChange
      locales={localeToUse ?? "en"}
    />
  );
}
