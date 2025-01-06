import { products } from "@wix/stores";
import Badge from "./ui/badge";
import { Percent } from "lucide-react";

interface DiscountBadgeProps {
  data: products.Discount;
}
export default function DiscountBadge({ data }: DiscountBadgeProps) {
  if (data.type !== "PERCENT") {
    return null;
  }

  return (
    <Badge className="flex items-center text-sm">
      <span className="text-base">{data.value}</span>
      <Percent className="size-4" />
    </Badge>
  );
}
