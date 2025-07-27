"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { AnimatedNumber } from "../common/AnimatedNumber";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Props = {
  data: { currency: string; totalAmount: number; invoiceCount: number }[];
  totalInvoiceCount: number;
  title: string;
};

export function InvoiceSummarySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <Skeleton className="h-8 w-32" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceSummary({ data, totalInvoiceCount, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const company = useQuery(api.company.get);

  const dataWithDefaultCurrency = data?.length
    ? data
    : [{ currency: company?.baseCurrency, totalAmount: 0 }];

  const item = dataWithDefaultCurrency[activeIndex];

  if (!item) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2 relative">
        <CardTitle className="font-mono font-medium text-2xl">
          <AnimatedNumber
            key={item.currency}
            value={item.totalAmount}
            currency={item.currency ?? company?.baseCurrency ?? "USD"}
            maximumFractionDigits={0}
            minimumFractionDigits={0}
          />

          {dataWithDefaultCurrency.length > 1 && (
            <div className="flex space-x-2 top-[63px] absolute">
              {dataWithDefaultCurrency.map((item, idx) => (
                <div
                  key={item.currency}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "w-[10px] h-[3px] bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all",
                    idx === activeIndex && "opacity-100"
                  )}
                />
              ))}
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2">
          <div>{title}</div>
          <div className="text-sm text-muted-foreground">
            {totalInvoiceCount === 0
              ? "No invoices"
              : totalInvoiceCount === 1
              ? "1 invoice"
              : `${totalInvoiceCount} invoices`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
