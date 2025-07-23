"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signInRoute } from "@/lib/routeHelpers";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOut() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    setLoading(true);

    await signOut();
    router.push(signInRoute());
  };

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      {isLoading ? "Loading..." : "Sign out"}
    </DropdownMenuItem>
  );
}
