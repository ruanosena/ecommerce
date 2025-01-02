import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export default function Badge({ children, className }: BadgeProps) {
  return <span className={cn("", className)}>{children}</span>;
}
