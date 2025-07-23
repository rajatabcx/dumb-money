"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoveLeft, MoveRight } from "lucide-react";

interface HorizontalPaginationProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  className?: string;
}

export function HorizontalPagination({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  className,
}: HorizontalPaginationProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={!canScrollLeft}
        className="size-6 p-0"
        onClick={onScrollLeft}
      >
        <MoveLeft className={cn("size-3.5", canScrollLeft && "text-primary")} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!canScrollRight}
        className="size-6 p-0"
        onClick={onScrollRight}
      >
        <MoveRight
          className={cn("size-3.5", canScrollRight && "text-primary")}
        />
      </Button>
    </div>
  );
}
