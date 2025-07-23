"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence } from "motion/react";

type Props = {
  isExpanded?: boolean;
};

const team = {
  name: "Zama",
};

export function TeamDetails({ isExpanded = false }: Props) {
  return (
    <div className="relative h-[32px]">
      {/* Avatar - fixed position that absolutely never changes */}
      <div className="fixed left-[19px] bottom-4 w-[32px] h-[32px]">
        <div className="relative w-[32px] h-[32px]">
          <AnimatePresence>
            <Avatar className="w-[32px] h-[32px] rounded-none border border-[#DCDAD2] dark:border-[#2C2C2C] cursor-pointer">
              <AvatarImage
                src={""}
                alt={team?.name ?? ""}
                width={20}
                height={20}
              />
              <AvatarFallback className="rounded-none w-[32px] h-[32px]">
                <span className="text-xs">
                  {team?.name?.charAt(0)?.toUpperCase()}
                  {team?.name?.charAt(1)?.toUpperCase()}
                </span>
              </AvatarFallback>
            </Avatar>
          </AnimatePresence>
        </div>
      </div>

      {/* Team name - appears to the right of the fixed avatar */}
      {isExpanded ? (
        <div className="fixed left-[62px] bottom-4 h-[32px] flex items-center">
          <span className="text-sm text-primary truncate transition-opacity duration-200 ease-in-out cursor-pointer hover:opacity-80">
            {team.name}
          </span>
        </div>
      ) : null}
    </div>
  );
}
