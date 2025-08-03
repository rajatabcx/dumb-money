"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { X } from "lucide-react";
import { downloadFileAction } from "@/actions/downloadFile";

type Props = {
  companyId: Id<"company">;
};

export function Logo({ companyId }: Props) {
  const { watch, setValue } = useFormContext();
  const logoUrl = watch("template.logoUrl");
  const uploadUrl = useApiMutation(api.file.generateUploadUrl);

  const updateTemplateMutation = useApiMutation(api.invoices.upsertTemplate);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileUploadUrl = await uploadUrl.mutate();
        const response = await fetch(fileUploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const { storageId } = await response.json();

        const url = await downloadFileAction(storageId);

        setValue("template.logoUrl", url, { shouldValidate: true });

        updateTemplateMutation.mutate({
          template: { logoUrl: url },
          companyId: companyId,
        });
      } catch (error) {
        toast.error("Something went wrong, please try again.");
      }
    }
  };

  return (
    <div className="relative h-[80px] group">
      <label htmlFor="logo-upload" className="block h-full">
        {uploadUrl.isPending ? (
          <Skeleton className="w-full h-full" />
        ) : logoUrl ? (
          <>
            <img
              src={logoUrl}
              alt="Invoice logo"
              className="h-full w-auto max-w-none object-contain"
            />
            <button
              type="button"
              className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-col gap-1"
              style={{ width: "auto" }}
              onClick={(e) => {
                e.preventDefault();
                setValue("template.logoUrl", undefined, {
                  shouldValidate: true,
                });
                updateTemplateMutation.mutate({
                  template: { logoUrl: undefined },
                  companyId: companyId,
                });
              }}
            >
              <X className="size-4" />
              <span className="text-xs font-medium">Remove</span>
            </button>
          </>
        ) : (
          <div className="h-[80px] w-[80px] bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
        )}
      </label>

      <input
        id="logo-upload"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleUpload}
        disabled={uploadUrl.isPending}
      />
    </div>
  );
}
