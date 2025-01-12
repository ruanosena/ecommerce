import { useCartCheckout } from "@/hooks/checkout";
import { ButtonProps } from "./ui/button";
import LoadingButton from "./LoadingButton";

export default function CheckoutButton({ children, ...props }: ButtonProps) {
  const { startCheckoutFlow, pending } = useCartCheckout();

  return (
    <LoadingButton onClick={startCheckoutFlow} loading={pending} {...props}>
      {children ?? "Finalizar compra"}
    </LoadingButton>
  );
}
