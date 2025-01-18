import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getWixServerClient } from "@/lib/wix-client.server";
import { ProductsSort, queryProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    pagina?: string;
    colecao?: string[];
    preco_min?: string;
    preco_max?: string;
    ordenacao?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: q ? `Resultados para "${q}"` : "Produtos",
  };
}

export default async function Page({ searchParams }: PageProps) {
  const {
    q,
    pagina: page = "1",
    colecao: collectionIds,
    preco_min: price_min,
    preco_max: price_max,
    ordenacao: sort,
  } = await searchParams;

  const title = q ? `Resultados para "${q}"` : "Produtos";

  return (
    <div className="space-y-10">
      <h1 className="text-center text-xl font-bold md:text-2xl">{title}</h1>
      <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
        <ProductResults
          q={q}
          page={parseInt(page)}
          collectionIds={collectionIds}
          priceMin={price_min ? parseInt(price_min) : undefined}
          priceMax={price_max ? parseInt(price_max) : undefined}
          sort={sort as ProductsSort}
        />
      </Suspense>
    </div>
  );
}

interface ProductResultsProps {
  q?: string;
  page: number;
  collectionIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: ProductsSort;
}

async function ProductResults({
  q,
  page,
  collectionIds,
  priceMin,
  priceMax,
  sort,
}: ProductResultsProps) {
  const pageSize = 8; // FIXME: change to 12

  const products = await queryProducts(await getWixServerClient(), {
    q,
    limit: pageSize,
    skip: (page - 1) * pageSize,
    collectionIds,
    priceMin,
    priceMax,
    sort,
  });

  if (page > (products.totalPages || 1)) notFound();

  return (
    <div className="space-y-10 group-has-[[data-pending]]:animate-pulse">
      <p className="text-center text-base md:text-lg">
        {products.totalCount}{" "}
        {products.totalCount === 1
          ? "produto encontrado"
          : "produtos encontrados"}
      </p>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {products.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <div className="py-1 md:py-[0.3125rem]">
        <Skeleton className="mx-auto h-4 w-52 md:h-[1.125rem]" />
      </div>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-full border bg-card">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-3 p-3">
              <div className="py-1">
                <Skeleton className="h-5 w-4/6" />
              </div>
              <div className="pb-6">
                <div className="py-1">
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="py-1">
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="py-1">
                  <Skeleton className="h-4 w-3/6" />
                </div>
                <div className="py-1">
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
