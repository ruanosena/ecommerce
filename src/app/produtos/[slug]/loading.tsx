import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
      <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
        <div className="basis-2/5">
          <Skeleton className="aspect-square w-full" />
        </div>
        <div className="basis-3/5 space-y-5">
          <div className="py-1 lg:py-[3px] lg:pb-12">
            <Skeleton className="h-6 w-56 lg:h-[1.875rem]" />
          </div>
          <div className="lg:pb-[calc(1.75rem_*_2)]">
            <div className="py-1.5">
              <Skeleton className="h-4 w-11/12" />
            </div>
            <div className="py-1.5">
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="py-1.5">
              <Skeleton className="h-4 w-11/12" />
            </div>
            <div className="py-1.5">
              <Skeleton className="h-4 w-10/12" />
            </div>
            <div className="py-1.5">
              <Skeleton className="h-4 w-11/12" />
            </div>
          </div>
          <div className="py-1">
            <Skeleton className="h-8 w-28" />
          </div>
          <Skeleton className="h-6 w-full pt-7" />
        </div>
      </div>
    </main>
  );
}
