"use client";

import { useCustomerParams } from "@/hooks/useCustomerParams";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { CustomerForm } from "@/components/customer/Form";
import { Id } from "../../../convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { MoreVertical } from "lucide-react";

export function CustomerEditSheet({ companyId }: { companyId: Id<"company"> }) {
  const { setParams, customerId } = useCustomerParams();

  const isOpen = Boolean(customerId);

  const customer = useQuery(
    api.customer.getById,
    isOpen
      ? {
          id: customerId!,
        }
      : "skip"
  );

  const deleteCustomerMutation = useApiMutation(api.customer.deleteCustomer);

  return (
    <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
      <SheetContent stack>
        <SheetHeader className="mb-6 flex justify-between items-center flex-row">
          <h2 className="text-xl">Edit Customer</h2>

          {customerId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="cursor-pointer p-2">
                  <MoreVertical className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={10} align="end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the customer and remove their data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          deleteCustomerMutation.mutate({ id: customerId })
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SheetHeader>

        <CustomerForm
          data={customer}
          key={customer?._id}
          companyId={companyId}
        />
      </SheetContent>
    </Sheet>
  );
}
