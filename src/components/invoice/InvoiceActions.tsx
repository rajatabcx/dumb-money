"use client";

import { useInvoiceParams } from "@/hooks/useInvoiceParams";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Bell, MoreHorizontal, Pencil } from "lucide-react";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { sendInvoiceReminderEmail } from "@/actions/sendInvoiceReminder";
import { useState } from "react";
import { sendInvoicePaidEmail } from "@/actions/sendInvoicePaid";

type Props = {
  status: string;
  id: Id<"invoices">;
  companyId: Id<"company">;
};

export function InvoiceActions({ status, id, companyId }: Props) {
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [isSendingPaid, setIsSendingPaid] = useState(false);
  const { setParams } = useInvoiceParams();

  const updateInvoiceMutation = useApiMutation(api.invoices.updateInvoice);
  const markAsUnpaidMutation = useApiMutation(api.invoices.markAsUnpaid);

  const deleteInvoiceMutation = useApiMutation(api.invoices.deleteInvoice);

  const sendReminderMutation = useApiMutation(api.invoices.sendReminder);

  const handleDeleteInvoice = () => {
    deleteInvoiceMutation.mutate({ id: id as Id<"invoices">, companyId });
    setParams(null);
  };

  const handleSendReminder = () => {
    sendReminderMutation.mutate({ id, date: new Date().toISOString() });
    setIsSendingReminder(true);
    sendInvoiceReminderEmail(id);
    setIsSendingReminder(false);
  };

  const handleMarkAsPaid = (date: Date | undefined) => {
    setIsSendingPaid(true);
    if (date) {
      updateInvoiceMutation.mutate({
        id,
        status: "paid",
        paidAt: date.toISOString(),
      });
    } else {
      // NOTE: Today is undefined
      updateInvoiceMutation.mutate({
        id,
        status: "paid",
        paidAt: new Date().toISOString(),
      });
    }
    sendInvoicePaidEmail(id);
    setIsSendingPaid(false);
  };

  switch (status) {
    case "canceled":
    case "paid":
      return (
        <div className="absolute right-4 mt-7">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="hover:bg-secondary cursor-pointer"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  markAsUnpaidMutation.mutate({
                    id,
                  })
                }
              >
                Mark as unpaid
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={handleDeleteInvoice}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );

    case "overdue":
    case "unpaid":
      return (
        <div className="flex space-x-2 mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="flex items-center space-x-2 hover:bg-secondary w-full cursor-pointer"
                disabled={sendReminderMutation.isPending || isSendingReminder}
              >
                <Bell className="size-3.5" />
                <span>Remind</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Send Reminder</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to send a reminder for this invoice?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={() => {
                    handleSendReminder();
                  }}
                  disabled={sendReminderMutation.isPending || isSendingReminder}
                >
                  Send Reminder
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            size="sm"
            variant="secondary"
            className="flex items-center space-x-2 hover:bg-secondary w-full cursor-pointer"
            onClick={() => setParams({ invoiceId: id, type: "edit" })}
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-secondary cursor-pointer"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={10} align="end">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className="cursor-pointer"
                  disabled={isSendingPaid}
                >
                  Mark as paid
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <Calendar
                    mode="single"
                    toDate={new Date()}
                    selected={new Date()}
                    onSelect={(date) => {
                      handleMarkAsPaid(date);
                    }}
                    initialFocus
                  />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={() =>
                  updateInvoiceMutation.mutate({
                    id,
                    status: "canceled",
                  })
                }
              >
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    case "draft":
      return (
        <div className="flex space-x-2 mt-8">
          <Button
            size="sm"
            variant="secondary"
            className="flex items-center space-x-2 hover:bg-secondary w-full cursor-pointer"
            onClick={() => setParams({ invoiceId: id, type: "edit" })}
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="hover:bg-secondary cursor-pointer"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} align="end">
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteInvoice}
              >
                Delete draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    default:
      return null;
  }
}
