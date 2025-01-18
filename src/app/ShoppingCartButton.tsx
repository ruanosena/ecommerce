"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import WixImage from "@/components/WixImage";
import {
  useCart,
  useRemoveCartItem,
  useUpdateItemQuantity,
} from "@/hooks/cart";
import { cn } from "@/lib/utils";
import { currentCart } from "@wix/ecom";
import { Loader2, Minus, Plus, ShoppingBag, Trash } from "lucide-react";
import Link from "next/link";
import { Fragment, useState } from "react";
import BigIconButton from "./NavbarButton";
import CheckoutButton from "@/components/CheckoutButton";

interface ShoppingCartButtonProps {
  initialData: currentCart.Cart | null;
}

export default function ShoppingCartButton({
  initialData,
}: ShoppingCartButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const cartQuery = useCart(initialData);

  const totalQuantity =
    cartQuery.data?.lineItems?.reduce(
      (acc, item) => acc + (item.quantity ?? 0),
      0,
    ) ?? 0;

  return (
    <>
      <BigIconButton
        variant="ghost"
        className="relative"
        onClick={() => setSheetOpen(true)}
      >
        <ShoppingBag />
        <span
          className={cn(
            "absolute bottom-0 left-7 flex size-7 items-center justify-center rounded-full border-[3px] border-background bg-violet-400 font-bold text-foreground",
          )}
        >
          {totalQuantity < 10 ? totalQuantity : "9+"}
        </span>
        <p className="hidden text-[0.8125rem]/[1rem] lg:block">
          Sacola de <br /> compras
        </p>
      </BigIconButton>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              Sua sacola{" "}
              <span className="text-base">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "itens"})
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex grow flex-col space-y-5 overflow-y-auto">
            <ul className="space-y-2.5">
              {cartQuery.data?.lineItems?.map((item, index, array) => (
                <Fragment key={item._id}>
                  <ShoppingCartItem
                    item={item}
                    onProductLinkClicked={() => setSheetOpen(false)}
                  />
                  {index !== array.length - 1 && <Separator />}
                </Fragment>
              ))}
            </ul>

            {cartQuery.isPending && (
              <Loader2 className="mx-auto size-6 animate-spin" />
            )}

            {cartQuery.error && (
              <p className="text-destructive">{cartQuery.error.message}</p>
            )}

            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow items-center justify-center text-center">
                <div className="space-y-1.5">
                  <p className="text-lg font-semibold">Sua sacola está vazia</p>
                  <Link
                    href="/loja"
                    className="text-primary underline hover:underline"
                    onClick={() => setSheetOpen(false)}
                  >
                    Comece a comprar agora
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Separator />
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div className="space-y-0.5">
              <p>Subtotal:</p>
              <p className="font-bold">
                {/* @ts-expect-error subtotal não está presente na tipagem */}
                {cartQuery.data?.subtotal?.formattedConvertedAmount}
              </p>
              <p className="text-balance text-sm text-muted-foreground">
                frete e impostos calculados na finalização da compra
              </p>
            </div>

            <CheckoutButton
              size="lg"
              className="text-lg"
              disabled={!totalQuantity || cartQuery.isFetching}
            >
              Continuar
            </CheckoutButton>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
  onProductLinkClicked: () => void;
}

function ShoppingCartItem({
  item,
  onProductLinkClicked,
}: ShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateItemQuantity();

  const removeItemMutation = useRemoveCartItem();

  const productId = item._id;

  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className="grid grid-cols-[110px,_1fr] gap-x-3 gap-y-1.5 [grid-template-areas:'image_info''controls_controls'] sm:[grid-template-areas:'image_info''._controls']">
      <Link
        className="[grid-area:image]"
        href={`/produtos/${slug}`}
        onClick={onProductLinkClicked}
      >
        <WixImage
          mediaIdentifier={item.image}
          width={110}
          height={110}
          alt={item.productName?.translated || "Imagem do produto"}
          className="flex-none bg-secondary"
        />
      </Link>
      <div className="space-y-1.5 text-sm [grid-area:info]">
        <Link href={`/produtos/${slug}`} onClick={onProductLinkClicked}>
          <p className="font-bold">{item.productName?.translated || "item"}</p>
        </Link>

        {!!item.descriptionLines?.length && (
          <p>
            {item.descriptionLines
              .map(
                (line) =>
                  line.colorInfo?.translated ?? line.plainText?.translated,
              )
              .join(", ")}
          </p>
        )}

        <div className="flex items-center gap-2">
          {item.quantity} x {item.price?.formattedConvertedAmount}
          {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
            <span className="text-xs text-muted-foreground line-through">
              {item.fullPrice.formattedConvertedAmount}
            </span>
          )}
        </div>
      </div>

      <div className="[grid-area:controls]">
        <div className="flex justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={item.quantity === 1}
              onClick={() =>
                updateQuantityMutation.mutate({
                  productId,
                  newQuantity: !item.quantity ? 0 : item.quantity - 1,
                })
              }
            >
              <Minus />
            </Button>
            <span className="px-3">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={quantityLimitReached}
              onClick={() =>
                updateQuantityMutation.mutate({
                  productId,
                  newQuantity: !item.quantity ? 1 : item.quantity + 1,
                })
              }
            >
              <Plus />
            </Button>
          </div>

          <div>
            <Button
              size="icon"
              className="bg-secondary text-muted-foreground hover:bg-secondary/80"
              onClick={() => removeItemMutation.mutate(productId)}
            >
              <Trash />
            </Button>
          </div>
        </div>
        {quantityLimitReached && (
          <span className="text-sm">Limite máximo de itens</span>
        )}
      </div>
    </li>
  );
}
