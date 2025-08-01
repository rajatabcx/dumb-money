"use client";

import React from "react";
import { ConvexClientProvider } from "./ConvexProviderWithClerk";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <TooltipProvider delayDuration={0}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </TooltipProvider>
      <Toaster />
    </ConvexClientProvider>
  );
}
