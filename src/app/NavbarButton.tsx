import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BigIconButton({
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn("relative h-auto p-2 text-left [&_svg]:size-10", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
