import React from "react";
import { ConvexClientProvider } from "./ConvexProviderWithClerk";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </ConvexClientProvider>
  );
}
