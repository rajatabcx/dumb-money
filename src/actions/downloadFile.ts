"use server";

import { fetchQuery } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";

export async function downloadFileAction(storageId?: Id<"_storage">) {
  if (!storageId) {
    return;
  }

  const token = await getAuthToken();
  const url = await fetchQuery(
    api.file.getInvoiceDownloadUrl,
    {
      id: storageId,
    },
    { token }
  );

  if (!url) {
    return;
  }

  return url;
}
