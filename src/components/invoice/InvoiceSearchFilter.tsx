"use client";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { formatISO } from "date-fns";
import { CalendarDays, ListFilter, Search, Smile, Tickets } from "lucide-react";
import { useState } from "react";
import { useInvoiceFilterParams } from "@/hooks/useInvoiceFilterParams";
import { FilterList } from "./FilterList";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const allowedStatuses = [
  "draft",
  "overdue",
  "paid",
  "unpaid",
  "canceled",
] as const;

export function InvoiceSearchFilter({
  companyId,
}: {
  companyId: Id<"company">;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { setFilter, filter } = useInvoiceFilterParams();
  const statusFilters = allowedStatuses.map((status) => ({
    id: status,
    name: status,
  }));

  const handleSubmit = async () => {
    setFilter({
      q: filter.q,
    });
  };

  const customers = useQuery(api.customer.getAll, {
    companyId,
  });

  const validFilters = Object.fromEntries(
    Object.entries(filter).filter(([key]) => key !== "q")
  );

  const hasValidFilters = Object.values(validFilters).some(
    (value) => value !== null
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-start sm:items-center w-full">
        <form
          className="relative w-full sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Search className="absolute pointer-events-none left-3 top-[11px] size-4 text-muted-foreground" />
          <Input
            placeholder="Search or filter"
            className="pl-9 w-full sm:w-[350px] pr-8"
            value={filter.q}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />

          <DropdownMenuTrigger asChild>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              type="button"
              className={cn(
                "absolute z-10 right-3 top-[10px] opacity-50 transition-opacity duration-300 hover:opacity-100",
                hasValidFilters && "opacity-100",
                isOpen && "opacity-100"
              )}
            >
              <ListFilter className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
        </form>

        <FilterList
          filters={validFilters}
          onRemove={setFilter}
          statusFilters={statusFilters}
          customers={customers}
        />
      </div>

      <DropdownMenuContent
        className="w-[350px]"
        sideOffset={19}
        alignOffset={-11}
        side="bottom"
        align="end"
      >
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Due Date</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                sideOffset={14}
                alignOffset={-4}
                className="p-0"
              >
                <Calendar
                  mode="range"
                  initialFocus
                  selected={{
                    from: filter?.start ? new Date(filter.start) : undefined,
                    to: filter?.end ? new Date(filter.end) : undefined,
                  }}
                  onSelect={(range) => {
                    setFilter({
                      start: range?.from
                        ? formatISO(range.from, { representation: "date" })
                        : null,
                      end: range?.to
                        ? formatISO(range.to, { representation: "date" })
                        : null,
                    });
                  }}
                />
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Smile className="mr-2 h-4 w-4" />
              <span>Customer</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                sideOffset={14}
                alignOffset={-4}
                className="p-0"
              >
                {customers?.map((customer) => (
                  <DropdownMenuCheckboxItem
                    key={customer._id}
                    onCheckedChange={() => {
                      setFilter({
                        customers: filter?.customers?.includes(customer._id)
                          ? filter.customers.filter((s) => s !== customer._id)
                          : [...(filter?.customers ?? []), customer._id],
                      });
                    }}
                  >
                    {customer.name}
                  </DropdownMenuCheckboxItem>
                ))}

                {!customers?.length && (
                  <DropdownMenuItem disabled>
                    No customers found
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tickets className="mr-2 h-4 w-4" />
              <span>Status</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                sideOffset={14}
                alignOffset={-4}
                className="p-0"
              >
                {statusFilters?.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.id}
                    onCheckedChange={() => {
                      setFilter({
                        statuses: filter?.statuses?.includes(status.id)
                          ? filter.statuses.filter((s) => s !== status.id)
                          : [...(filter?.statuses ?? []), status.id],
                      });
                    }}
                  >
                    {status.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
