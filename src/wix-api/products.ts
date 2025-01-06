import { WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilter {
  collectionIds?: string[] | string;
  sort?: ProductsSort;
}
export async function queryProducts(
  wixClient: WixClient,
  { collectionIds, sort = "last_updated" }: QueryProductsFilter,
) {
  let query = wixClient.products.queryProducts();

  const collectionsIdArray = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];

  if (collectionsIdArray.length) {
    query = query.hasSome("collectionIds", collectionsIdArray);
  }

  switch (sort) {
    case "price_asc":
      query = query.ascending("price");
      break;
    case "price_desc":
      query = query.descending("price");
      break;
    case "last_updated":
      query = query.descending("lastUpdated");
      break;
  }

  return query.find();
}

export const getProductBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { items } = await wixClient.products
      .queryProducts()
      .eq("slug", slug)
      .limit(1)
      .find();

    const product = items[0];

    if (!product || !product.visible) {
      return null;
    }

    return product;
  },
);