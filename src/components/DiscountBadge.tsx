import { products } from "@wix/stores";
import Badge from "./ui/badge";

interface DiscountBadgeProps {
  data: products.Discount;
}
export default function DiscountBadge({ data }: DiscountBadgeProps) {
  if (data.type !== "PERCENT") {
    return null;
  }

  return (
    <Badge className="text-sm">
      <span className="text-base">{data.value}</span>%
    </Badge>
  );
}
