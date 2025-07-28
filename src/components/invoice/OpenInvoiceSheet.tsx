"use client";

import { Button } from "@/components/ui/button";
import { useInvoiceParams } from "@/hooks/useInvoiceParams";
import { Plus } from "lucide-react";

export function OpenInvoiceSheet() {
  const { setParams } = useInvoiceParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ type: "create" })}
        className="cursor-pointer"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
