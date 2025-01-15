import { getProductBySlug, getRelatedProduts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(await getWixServerClient(), slug);

  if (!product) notFound();

  const mainImage = product.media?.mainMedia?.image;

  return {
    title: product.name,
    description: "Compre este produto na Ruan Store",
    openGraph: {
      images: mainImage?.url
        ? [
            {
              url: mainImage.url,
              width: mainImage.width,
              height: mainImage.height,
              alt: mainImage.altText ?? "Imagem do produto",
            },
          ]
        : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  await delay(3000);
  const { slug } = await params;
  const product = await getProductBySlug(await getWixServerClient(), slug);

  if (!product?._id) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <ProductDetails product={product} />
      <Separator />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
    </main>
  );
}

interface RelatedProductsProps {
  productId: string;
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  await delay(2000);

  const relatedProducts = await getRelatedProduts(
    await getWixServerClient(),
    productId,
  );

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Produtos relacionados</h2>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-[3.25rem] sm:grid lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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
