import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import { useQuickBuy } from "@/hooks/checkout";
import LoadingButton from "./LoadingButton";
import { CreditCardIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyNowButtonProps extends ButtonProps {
  product: products.Product;
  quantity: number;
  selectedOptions: Record<string, string>;
}

export default function BuyNowButton({
  product,
  quantity,
  selectedOptions,
  className,
  ...props
}: BuyNowButtonProps) {
  const { startCheckoutFlow, pending } = useQuickBuy();

  return (
    <LoadingButton
      onClick={() => startCheckoutFlow({ product, quantity, selectedOptions })}
      loading={pending}
      className={cn(
        "flex gap-3 bg-violet-500 text-primary-foreground hover:bg-violet-500/80",
        className,
      )}
      {...props}
    >
      <CreditCardIcon />
      Comprar Agora
    </LoadingButton>
  );
}
