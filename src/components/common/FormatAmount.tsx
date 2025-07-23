"use client";

import { formatAmount } from "@/lib/format";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Props = {
  amount: number;
  currency: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  locale?: string;
};

export function FormatAmount({
  amount,
  currency,
  maximumFractionDigits,
  minimumFractionDigits,
  locale,
}: Props) {
  const user = useQuery(api.user.currentUser);

  return formatAmount({
    locale: locale || user?.locale,
    amount: amount,
    currency,
    maximumFractionDigits,
    minimumFractionDigits,
  });
}
