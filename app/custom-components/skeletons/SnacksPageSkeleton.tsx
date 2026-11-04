/* Section: Shimmer Base */

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted ${className ?? ""}`}
    />
  );
}

/* Section: Food Card Skeleton */

function FoodCardSkeleton() {
  return (
    <article className="flex flex-col justify-between w-full rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 md:rounded-2xl md:p-4 2xl:rounded-3xl 2xl:p-5">
      {/* Image placeholder */}
      <div className="relative h-40 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 md:h-48 md:rounded-xl 2xl:h-56 2xl:rounded-2xl">
        <Shimmer className="absolute inset-0 rounded-none" />
        {/* Serving badge placeholder */}
        <div className="absolute top-2 left-2">
          <Shimmer className="h-5 w-16 rounded-md" />
        </div>
      </div>

      {/* Info placeholder */}
      <div className="flex flex-col gap-2.5 mt-2.5 md:mt-3">
        <Shimmer className="h-5 w-3/4 md:h-6" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>

      {/* Footer placeholder */}
      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80 md:mt-4 md:pt-3.5 2xl:mt-5 2xl:pt-4">
        <Shimmer className="h-5 w-14 md:h-6 md:w-16" />
        <Shimmer className="h-8 w-16 rounded-lg" />
      </div>
    </article>
  );
}

/* Section: Main Export */

export default function SnacksPageSkeleton() {
  return (
    <section className="flex flex-col gap-5 md:gap-0">
      {/* Header Skeleton */}
      <div className="mt-6 md:mt-8 mb-4 md:mb-6 flex flex-col gap-3">
        <Shimmer className="h-8 w-52 md:h-20 md:w-[560px]" />
        <Shimmer className="h-3 w-72 md:h-4 md:w-[480px]" />
        <Shimmer className="h-3 w-48 md:hidden" />
      </div>

      {/* Grid Skeleton */}
      <div className="md:py-3 rounded-2xl md:px-3 md:border border-foreground/5 bg-foreground/1 md:mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
