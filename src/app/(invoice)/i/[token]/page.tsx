import CustomerHeader from "@/components/invoice/public/CustomHeader";
import { HtmlTemplate } from "@/components/invoice/public/HtmlTemplate";
import InvoiceToolbar from "@/components/invoice/public/InvoiceToolbar";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs";
import { api } from "../../../../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { decrypt } from "@/lib/encrypt";
import { PdfTemplate } from "@/components/invoice/pdf";

export async function generateMetadata(props: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  try {
    const authToken = await getAuthToken();
    const invoice = await fetchQuery(
      api.invoices.getInvoiceByToken,
      {
        token: params.token,
      },
      {
        token: authToken,
      }
    );

    if (!invoice) {
      return {
        title: "Invoice Not Found",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = `Invoice ${invoice.invoiceNumber} | ${invoice.company?.name}`;
    const description = `Invoice for ${
      invoice.customerName || invoice.customer?.name || "Customer"
    }`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch (error) {
    return {
      title: "Invoice Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const user = await currentUser();
  const params = await props.params;

  const searchParams = await props.searchParams;
  const viewer = decodeURIComponent(searchParams?.viewer as string);

  const authToken = await getAuthToken();
  const invoice = await fetchQuery(
    api.invoices.getInvoiceByToken,
    {
      token: params.token,
    },
    {
      token: authToken,
    }
  );

  if (!invoice) {
    notFound();
  }

  // If the invoice is draft and the user is not logged in, return 404 or if the invoice is not found
  if (!invoice || (invoice.status === "draft" && !user)) {
    notFound();
  }

  if (viewer) {
    try {
      const decryptedEmail = decrypt(viewer);

      if (decryptedEmail === invoice?.customer?.email) {
        await fetchMutation(api.invoices.updateInvoice, {
          id: invoice._id,
          viewedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const width = invoice.template.size === "letter" ? 750 : 595;
  const height = invoice.template.size === "letter" ? 1056 : 842;
  console.log("invoice", invoice);

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen dotted-bg p-4 sm:p-6 md:p-0">
        <div
          className="flex flex-col w-full max-w-full py-6"
          style={{ maxWidth: width }}
        >
          <CustomerHeader
            name={invoice.customerName || (invoice.customer?.name as string)}
            website={invoice.customer?.website}
            status={invoice.status}
          />
          <div className="pb-24 md:pb-0">
            <div className="shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
              <HtmlTemplate data={invoice} width={width} height={height} />
            </div>
          </div>
        </div>

        <InvoiceToolbar
          token={invoice.token}
          invoiceNumber={invoice.invoiceNumber || "invoice"}
          storageId={invoice.storageId}
        />

        <div className="fixed bottom-4 right-4 hidden md:block">
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}?utm_source=invoice`}
            target="_blank"
            rel="noreferrer"
            className="text-[9px] text-[#878787]"
          >
            Powered by <span className="text-primary">dumb-money</span>
          </a>
        </div>
      </div>
    </>
  );
}
