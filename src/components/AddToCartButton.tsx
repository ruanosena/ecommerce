import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { useAddItemToCart } from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const mutation = useAddItemToCart();

  return (
    <LoadingButton
      onClick={() =>
        mutation.mutate({
          product,
          selectedOptions,
          quantity,
        })
      }
      loading={mutation.isPending}
      className={cn("flex gap-2", className)}
      {...props}
    >
      <ShoppingBag />
      Adicionar à sacola
    </LoadingButton>
  );
}
