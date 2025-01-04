import Image from "next/image";
import banner from "@/assets/banner.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { delay } from "@/lib/utils";
import { Suspense } from "react";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollectionsBySlug } from "@/wix-api/collections";
import { queryProducts } from "@/wix-api/products";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <div className="flex items-center bg-secondary md:h-96">
        <div className="space-y-7 p-10 text-center md:w-1/2">
          <h1 className="text-3xl font-bold md:text-4xl">
            Preencha o vazio no seu coração
          </h1>
          <p>Dia difícil? Compre algo especial e fique feliz novamente!</p>
          <Button className="text-lg" asChild>
            <Link href="/loja">
              Compre agora <ArrowRight className="ml-1 size-8" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden h-full w-1/2 md:block">
          <Image
            src={banner}
            alt="Ruan Store banner"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent" />
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  await delay(1000);

  const collection = await getCollectionsBySlug("destaque");

  if (!collection?._id) {
    return null;
  }

  const destaque = await queryProducts({ collectionIds: collection._id });

  if (!destaque.items.length) {
    return null;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Destaque</h2>
      <div className="flex grid-cols-2 flex-col gap-5 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {destaque.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-14 sm:grid md:grid-cols-3 lg:grid-cols-4">
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
