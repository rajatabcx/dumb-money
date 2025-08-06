"use client";

import { updateColumnVisibilityAction } from "@/actions/updateColumnVisibility";
import { LoadMore } from "@/components/common/LoadMore";
import { useInvoiceFilterParams } from "@/hooks/useInvoiceFilterParams";
import { useSortParams } from "@/hooks/useSortParams";
import { useTableScroll } from "@/hooks/useTableScroll";
import { Cookies } from "@/lib/constants";
import { Table, TableBody } from "@/components/ui/table";
import {
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { use, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { InvoiceSkeleton } from "@/components/invoice/Skeleton";

import { columns } from "./Columns";
import { NoResults } from "./EmptyStates";
import { EmptyState } from "./EmptyStates";
import { InvoiceRow } from "./InvoiceRow";
import { TableHeader } from "./TableHeader";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useInvoiceStore } from "@/store/invoice";
import { Id } from "../../../convex/_generated/dataModel";

type Props = {
  columnVisibility: Promise<VisibilityState>;
  companyId: Id<"company">;
};

export function DataTable({
  columnVisibility: columnVisibilityPromise,
  companyId,
}: Props) {
  const { params } = useSortParams();
  const { filter, hasFilters } = useInvoiceFilterParams();
  const { ref, inView } = useInView();
  const user = useQuery(api.user.currentUser);

  const { setColumns } = useInvoiceStore();
  const initialColumnVisibility = use(columnVisibilityPromise);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility ?? {}
  );

  const tableScroll = useTableScroll({
    useColumnWidths: true,
    startFromColumn: 1,
  });

  const { results, status, loadMore } = usePaginatedQuery(
    api.invoices.getCompanyInvoices,
    {
      ...filter,
      sort: params.sort ?? [],
      companyId,
    },
    {
      initialNumItems: 25,
    }
  );

  const tableData = useMemo(() => {
    return results ?? [];
  }, [results]);

  useEffect(() => {
    if (inView) {
      loadMore(25);
    }
  }, [inView]);

  useEffect(() => {
    updateColumnVisibilityAction({
      key: Cookies.InvoicesColumns,
      data: columnVisibility,
    });
  }, [columnVisibility]);

  const table = useReactTable({
    data: tableData,
    getRowId: ({ id }) => id,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
    meta: {
      dateFormat: user?.dateFormat,
    },
  });

  useEffect(() => {
    setColumns(table.getAllLeafColumns());
  }, [columnVisibility]);

  if (status === "LoadingFirstPage") {
    return <InvoiceSkeleton />;
  }

  if (hasFilters && !tableData?.length) {
    return <NoResults />;
  }

  if (!tableData?.length && status === "Exhausted") {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      <div
        ref={(el) => {
          tableScroll.containerRef.current = el;
          tableScroll.setIsRefsReady(true);
        }}
        className="overflow-x-auto overscroll-x-none md:border-l md:border-r border-border scrollbar-hide"
      >
        <Table>
          <TableHeader table={table} tableScroll={tableScroll} />

          <TableBody className="border-l-0 border-r-0">
            {table.getRowModel().rows.map((row) => (
              <InvoiceRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </div>

      <LoadMore ref={ref} hasNextPage={status === "CanLoadMore"} />
    </div>
  );
}
