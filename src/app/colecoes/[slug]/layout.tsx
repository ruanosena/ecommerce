import { Skeleton } from "@/components/ui/skeleton";
import WixImage from "@/components/WixImage";
import { cn, delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionsBySlug } from "@/wix-api/collections";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CollectionsLayout params={params}>{children}</CollectionsLayout>
    </Suspense>
  );
}

async function CollectionsLayout({ children, params }: LayoutProps) {
  await delay(2000);

  let { slug } = await params;
  slug = decodeURIComponent(slug);

  const collection = await getCollectionsBySlug(
    await getWixServerClient(),
    slug,
  );

  if (!collection) notFound();

  const banner = collection.media?.mainMedia?.image;

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <div className="flex flex-col gap-10">
        {banner && (
          <div className="relative hidden sm:block">
            <WixImage
              mediaIdentifier={banner.url}
              width={1280}
              height={400}
              alt={banner.altText}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
            <h1 className="lg: absolute bottom-10 left-1/2 -translate-x-1/2 text-4xl font-bold text-white lg:text-5xl">
              {collection.name}
            </h1>
          </div>
        )}
        <h1
          className={cn("mx-auto text-3xl font-bold md:text-4xl", {
            ["sm:hidden"]: banner,
          })}
        >
          {collection.name}
        </h1>
      </div>
      {children}
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <Skeleton className="mx-auto h-[1.875rem] w-48 py-[0.1875rem] sm:block sm:aspect-[1280/400] sm:size-full" />
      <div className="space-y-5">
        <h2 className="text-2xl font-bold">Produtos</h2>
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
      </div>
    </main>
  );
}
