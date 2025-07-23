"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "motion/react";
import { api } from "../../../convex/_generated/api";

type Props = {
  isExpanded?: boolean;
};

export function CompanyDetails({ isExpanded = false }: Props) {
  const company = useQuery(api.company.get);

  return (
    <div className="relative h-[32px]">
      {/* Avatar - fixed position that absolutely never changes */}
      <div className="fixed left-[19px] bottom-4 w-[32px] h-[32px]">
        <div className="relative w-[32px] h-[32px]">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Avatar className="w-[32px] h-[32px] rounded-none border">
                <AvatarImage
                  src={""}
                  alt={company?.name ?? ""}
                  width={20}
                  height={20}
                />
                <AvatarFallback className="rounded-none w-[32px] h-[32px]">
                  <span className="text-xs">
                    {company?.name?.charAt(0)?.toUpperCase()}
                    {company?.name?.charAt(1)?.toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Team name - appears to the right of the fixed avatar */}
      <AnimatePresence>
        {company && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-[62px] bottom-4 h-[32px] flex items-center"
          >
            <span className="text-sm text-primary truncate transition-opacity duration-200 ease-in-out hover:opacity-80">
              {company.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
