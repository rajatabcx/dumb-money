"use client";

import { cn } from "@/lib/utils";
import { FunctionReturnType } from "convex/server";
import { format } from "date-fns";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

type ActivityItemProps = {
  label: string;
  date?: string | number | null;
  completed: boolean;
  isLast?: boolean;
  timeFormat?: number | null;
};

function ActivityItem({
  label,
  date,
  completed,
  isLast,
  timeFormat,
}: ActivityItemProps) {
  return (
    <li className="relative pb-6 last:pb-0">
      {!isLast && (
        <div className="absolute left-[3px] top-[20px] bottom-0 border-[0.5px] border-border" />
      )}

      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative z-10 flex size-[7px] items-center justify-center rounded-full border border-border",
            completed && "bg-[#666666] border-[#666666]"
          )}
        />

        <div className="flex flex-1 items-center justify-between">
          <span
            className={cn(
              "text-sm",
              completed ? "text-primary" : "text-[#666666]"
            )}
          >
            {label}
          </span>

          <span className="text-sm text-[#666666]">
            {date &&
              format(
                new Date(date),
                `MMM d, ${timeFormat === 24 ? "HH:mm" : "h:mm a"}`
              )}
          </span>
        </div>
      </div>
    </li>
  );
}

type Props = {
  data: FunctionReturnType<typeof api.invoices.getInvoice>;
};

export function InvoiceActivity({ data }: Props) {
  const user = useQuery(api.user.currentUser);
  const completed = data?.paidAt !== null;

  return (
    <ul>
      {data?._creationTime && (
        <ActivityItem
          label="Created"
          date={data?._creationTime}
          completed
          timeFormat={user?.timeFormat ?? null}
        />
      )}
      {data?.sentAt && (
        <ActivityItem
          label="Sent"
          date={data?.sentAt}
          completed
          timeFormat={user?.timeFormat}
        />
      )}
      {data?.viewedAt && (
        <ActivityItem
          label="Viewed"
          date={data?.viewedAt}
          completed
          timeFormat={user?.timeFormat}
        />
      )}
      {data?.reminderSentAt && (
        <ActivityItem
          label="Reminder sent"
          date={data?.reminderSentAt}
          completed
          timeFormat={user?.timeFormat}
        />
      )}

      {data?.status !== "canceled" && (
        <ActivityItem
          label="Paid"
          date={data?.paidAt}
          completed={completed}
          isLast
          timeFormat={user?.timeFormat}
        />
      )}

      {data?.status === "canceled" && (
        <ActivityItem
          label="Canceled"
          completed
          date={data?.updatedAt}
          isLast
          timeFormat={user?.timeFormat}
        />
      )}
    </ul>
  );
}
