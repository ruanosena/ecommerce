import { getWixClient } from "@/lib/wix-client.base";

type ProductsSort = "last_updated" | "price_asc" | "price_desc";

interface QueryProductsFilter {
  collectionIds?: string[] | string;
  sort?: ProductsSort;
}
export async function queryProducts({
  collectionIds,
  sort = "last_updated",
}: QueryProductsFilter) {
  const wixClient = getWixClient();
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
