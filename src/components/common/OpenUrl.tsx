"use client";

import { cn } from "@/lib/utils";

export function OpenURL({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const handleOnClick = () => {
    window.open(href, "_blank");
  };

  return (
    <span onClick={handleOnClick} className={cn("cursor-pointer", className)}>
      {children}
    </span>
  );
}
