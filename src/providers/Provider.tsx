"use client";

import React from "react";
import { ConvexClientProvider } from "./ConvexProviderWithClerk";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </TooltipProvider>
      <Toaster />
    </ConvexClientProvider>
  );
}
