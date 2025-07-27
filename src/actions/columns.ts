import { Cookies } from "@/lib/constants";
import { cookies } from "next/headers";

export async function getInitialInvoicesColumnVisibility() {
  const cookieStore = await cookies();

  const columnsToHide = [
    "sentAt",
    "exclVat",
    "exclTax",
    "vatAmount",
    "taxAmount",
    "vatRate",
    "taxRate",
    "internalNote",
  ];

  const savedColumns = cookieStore.get(Cookies.InvoicesColumns)?.value;
  return savedColumns
    ? JSON.parse(savedColumns)
    : columnsToHide.reduce((acc, col) => {
        acc[col] = false;
        return acc;
      }, {} as Record<string, boolean>);
}
