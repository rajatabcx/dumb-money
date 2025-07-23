"use client";

import { CustomerCreateSheet } from "@/components/sheets/CustomerCreateSheet";
import { CustomerEditSheet } from "@/components/sheets/CustomerEditSheet";
import { InvoiceDetailsSheet } from "@/components/sheets/InvoiceDetailsSheet";
import { InvoiceSheet } from "@/components/sheets/InvoiceSheet";
import { use } from "react";

type Props = {
  currencyPromise: Promise<string>;
  countryCodePromise: Promise<string>;
};

export function GlobalSheets({ currencyPromise, countryCodePromise }: Props) {
  const currency = use(currencyPromise);
  const countryCode = use(countryCodePromise);

  return (
    <>
      {/* <TrackerUpdateSheet defaultCurrency={currency} />
      <TrackerCreateSheet defaultCurrency={currency} />
      <TrackerScheduleSheet /> */}

      <CustomerCreateSheet />
      <CustomerEditSheet />

      {/* <TransactionSheet />
      <TransactionCreateSheet /> */}

      {/* <AssistantModal />
      <SelectBankAccountsModal />
      <TrialEndedModal /> */}

      {/* <DocumentSheet /> */}

      {/* <ImportModal currencies={uniqueCurrencies} defaultCurrency={currency} /> */}
      {/* <ConnectTransactionsModal countryCode={countryCode} /> */}

      <InvoiceDetailsSheet />
      <InvoiceSheet />
    </>
  );
}
