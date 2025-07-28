"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import React from "react";
import { CustomerForm } from "@/components/customer/CreateForm";
import { X } from "lucide-react";
import { useCustomerParams } from "@/hooks/useCustomerParams";

export function CustomerCreateSheet() {
  const { setParams, createCustomer } = useCustomerParams();

  const isOpen = Boolean(createCustomer);

  return (
    <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
      <SheetContent stack>
        <SheetHeader className="mb-6 flex justify-between items-center flex-row">
          <h2 className="text-xl">Create Customer</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setParams(null)}
            className="p-0 m-0 size-auto hover:bg-transparent"
          >
            <X className="size-5" />
          </Button>
        </SheetHeader>

        <CustomerForm />
      </SheetContent>
    </Sheet>
  );
}
