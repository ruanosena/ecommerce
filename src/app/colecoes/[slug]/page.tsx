import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionsBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let { slug } = await params;
  slug = decodeURIComponent(slug);

  const collection = await getCollectionsBySlug(
    await getWixServerClient(),
    slug,
  );

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return {
    title: collection.name,
    description: collection.description,
    openGraph: { images: banner ? [{ url: banner.url }] : [] },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  let { slug } = await params;
  slug = decodeURIComponent(slug);

  const { pagina: page = "1" } = await searchParams;

  const collection = await getCollectionsBySlug(
    await getWixServerClient(),
    slug,
  );

  if (!collection?._id) notFound();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Produtos</h2>
      <Suspense fallback={<LoadingSkeleton />} key={page}>
        <Products collectionId={collection._id} page={parseInt(page)} />
      </Suspense>
    </div>
  );
}

interface ProductsProps {
  collectionId: string;
  page: number;
}

async function Products({ collectionId, page }: ProductsProps) {
  await delay(2000);

  const pageSize = 8; // FIXME: change its value to 12, so its dividable by grid cols

  const collectionProducts = await queryProducts(await getWixServerClient(), {
    collectionIds: collectionId,
    limit: pageSize,
    skip: (page - 1) * pageSize,
  });

  if (!collectionProducts.length) notFound();

  if (page > (collectionProducts.totalPages || 1)) notFound();

  return (
    <div className="space-y-10">
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {collectionProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar
        currentPage={page}
        totalPages={collectionProducts.totalPages || 1}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
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
  );
}
