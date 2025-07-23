import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  children,
  isSubmitting,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
  disabled?: boolean;
} & ButtonProps) {
  return (
    <Button
      disabled={isSubmitting || disabled}
      {...props}
      className={cn(props.className, "relative")}
    >
      <span style={{ visibility: isSubmitting ? "hidden" : "visible" }}>
        {children}
      </span>
      {isSubmitting && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="size-4 animate-spin" />
        </span>
      )}
    </Button>
  );
}
