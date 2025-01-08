import { products } from "@wix/stores";
import Badge from "./ui/badge";
import { Percent } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface DiscountBadgeProps {
  data: products.Discount;
}
export default function DiscountBadge({ data }: DiscountBadgeProps) {
  if (data.type !== "PERCENT") {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1}>
        <Badge className="flex items-center text-sm">
          <span>{data.value}</span>
          <Percent className="size-3.5" />
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Desconto</p>
      </TooltipContent>
    </Tooltip>
  );
}
