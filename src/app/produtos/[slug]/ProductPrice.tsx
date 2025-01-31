import DiscountBadge from "@/components/DiscountBadge";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductPriceProps {
  product: products.Product;
  selectedVariant: products.Variant | null;
}
export default function ProductPrice({
  product,
  selectedVariant,
}: ProductPriceProps) {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;

  if (!priceData) return null;

  const hasDiscount = priceData.discountedPrice !== priceData.price;

  return (
    <div className="flex items-center gap-2.5 text-2xl">
      <span
        className={cn({
          ["text-lg text-muted-foreground line-through"]: hasDiscount,
        })}
      >
        {priceData.formatted?.price}
      </span>

      {hasDiscount && (
        <span className="font-medium">
          {priceData.formatted?.discountedPrice}
        </span>
      )}

      {product.discount && <DiscountBadge data={product.discount} />}
    </div>
  );
}
