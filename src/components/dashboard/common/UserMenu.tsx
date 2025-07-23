"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SignOut } from "./Signout";
import { ThemeSwitch } from "./ThemeSwitch";

type Props = {
  onlySignOut?: boolean;
};

export function UserMenu({ onlySignOut }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer">
          {/* {user?.avatarUrl && (
            <AvatarImage
              src={""}
              alt={user?.fullName ?? ""}
              width={32}
              height={32}
            />
          )} */}
          <AvatarFallback>
            <span className="text-xs">
              RM
              {/* {user?.fullName?.charAt(0)?.toUpperCase()} */}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        {!onlySignOut && (
          <>
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="truncate line-clamp-1 max-w-[155px] block">
                    {/* {user?.fullName} */}
                    Rajat Mondal
                  </span>
                  <span className="truncate text-xs text-[#606060] font-normal">
                    {/* {user?.email} */}
                    rajat@zama.com
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link prefetch href="/account">
                <DropdownMenuItem>Account</DropdownMenuItem>
              </Link>

              <Link prefetch href="/account/support">
                <DropdownMenuItem>Support</DropdownMenuItem>
              </Link>

              <Link prefetch href="/account/teams">
                <DropdownMenuItem>Teams</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <div className="flex flex-row justify-between items-center p-2">
              <p className="text-sm">Theme</p>
              <ThemeSwitch />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
