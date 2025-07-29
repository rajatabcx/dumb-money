import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getWebsiteLogo } from "@/lib/invoice/logo";
import { InvoiceStatus } from "../InvoiceStatus";

type Props = {
  name: string;
  website?: string | null;
  status?: "overdue" | "paid" | "unpaid" | "draft" | "canceled";
};

export default function CustomerHeader({ name, website, status }: Props) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        {name && (
          <Avatar className="size-5 object-contain border border-border">
            {website && (
              <AvatarImage
                src={getWebsiteLogo(website)}
                alt={`${name} logo`}
                width={20}
                height={20}
              />
            )}
            <AvatarFallback className="text-[9px] font-medium">
              {name?.[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <span className="truncate text-sm">{name}</span>
      </div>

      <InvoiceStatus status={status} />
    </div>
  );
}
