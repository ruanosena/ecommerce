"use client";

import Badge from "@/components/ui/badge";
import { products } from "@wix/stores";
import ProductOptions from "./ProductOptions";
import { useState } from "react";
import { checkInStock, findVariant } from "@/lib/utils";
import ProductPrice from "./ProductPrice";
import ProductMedia from "./ProductMedia";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsProps {
  product: products.Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option) => ({
        [option.name ?? ""]: option.choices?.[0].description ?? "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) ?? {},
  );

  const selectedVariant = findVariant(product, selectedOptions);

  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity;

  const availableQuantityExceeded =
    !!availableQuantity && quantity > availableQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name ?? ""],
    );

    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }
      />

      <div className="basis-3/5 space-y-5">
        <div className="space-y-2.5">
          <h1 className="text-2xl font-medium lg:text-3xl">{product.name}</h1>
          {product.brand && (
            <div className="text-muted-foreground">{product.brand}</div>
          )}
          {product.ribbon && <Badge className="block">{product.ribbon}</Badge>}
        </div>

        {product.description && (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose dark:prose-invert"
          />
        )}

        <ProductPrice product={product} selectedVariant={selectedVariant} />

        <ProductOptions
          product={product}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />

        <div className="space-y-1.5">
          <Label htmlFor="quantidade">Quantidade</Label>
          <div className="flex items-center gap-2.5">
            <Input
              name="quantidade"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24"
              disabled={!inStock}
            />
            {!!availableQuantity &&
              (availableQuantityExceeded || availableQuantity < 10) && (
                <span className="text-destructive">
                  Restam apenas {availableQuantity} unidades
                </span>
              )}
          </div>
        </div>

        {inStock ? (
          <AddToCartButton
            product={product}
            selectedOptions={selectedOptions}
            quantity={quantity}
            disabled={availableQuantityExceeded || quantity < 1}
            className="w-full"
          />
        ) : (
          "Produto esgotado"
        )}

        {!!product.additionalInfoSections?.length && (
          <div className="space-y-1.5 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Info className="size-6" />
              <span>Informações adicionais do produto</span>
            </span>
            <Accordion type="multiple">
              {product.additionalInfoSections.map((section) => (
                <AccordionItem value={section.title ?? ""} key={section.title}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: section.description ?? "",
                      }}
                      className="prose text-muted-foreground dark:prose-invert"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}