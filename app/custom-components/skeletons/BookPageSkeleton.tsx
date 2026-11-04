/* Section: Shimmer Base */

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted ${className ?? ""}`}
    />
  );
}

/* Section: Arena Tab Skeleton */

function ArenaTabSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 rounded-[13px] px-3 md:px-4 py-3 md:py-4">
      <Shimmer className="h-5 w-16 md:h-7 md:w-24" />
      <Shimmer className="h-2.5 w-10 md:h-3 md:w-16" />
    </div>
  );
}

/* Section: Arena Info Card Skeleton */

function ArenaInfoCardSkeleton() {
  return (
    <div className="mt-2.5 bg-card dark:bg-background border border-foreground/15 dark:border-border rounded-2xl px-5 py-4 flex justify-between gap-4 items-start">
      <div className="flex flex-col gap-2 flex-1">
        <Shimmer className="h-3 w-20 md:h-4 md:w-28" />
        <Shimmer className="h-7 w-36 md:h-9 md:w-48" />
        <Shimmer className="h-3.5 w-full md:h-4 max-w-xs" />
        <div className="flex gap-2 flex-wrap mt-1">
          <Shimmer className="h-6 w-16 rounded-md" />
          <Shimmer className="h-6 w-20 rounded-md" />
          <Shimmer className="h-6 w-14 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Shimmer className="h-8 w-16 md:h-9 md:w-20" />
        <Shimmer className="h-2.5 w-20 md:h-3 md:w-24" />
        <Shimmer className="h-3 w-16" />
      </div>
    </div>
  );
}

/* Section: Device Card Skeleton */

function DeviceCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 md:p-3.5 flex flex-col gap-2">
      <Shimmer className="w-8 h-8 md:w-12 md:h-12 rounded-md" />
      <Shimmer className="h-4 w-20 md:h-5 md:w-28" />
      <Shimmer className="h-3 w-24 md:h-3.5 md:w-32" />
    </div>
  );
}

/* Section: Date Time Row Skeleton */

function DateTimeSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Shimmer className="h-3 w-24 md:h-5 md:w-36" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Shimmer className="h-10 rounded-xl" />
        <Shimmer className="h-10 rounded-xl" />
        <Shimmer className="h-10 rounded-xl" />
      </div>
      <Shimmer className="h-3 w-64 md:h-4" />
    </div>
  );
}

/* Section: Main Export */

export default function BookPageSkeleton() {
  return (
    <section className="flex flex-col gap-8 md:gap-10">
      {/* 1. Header Skeleton */}
      <div className="mt-6 md:mt-8 mb-4 md:mb-6 flex flex-col gap-3">
        <Shimmer className="h-9 w-56 md:h-20 md:w-[560px]" />
        <Shimmer className="h-3 w-72 md:h-4 md:w-[480px]" />
        <Shimmer className="h-3 w-48 md:hidden" />
      </div>

      {/* 2. Date and Time Skeleton */}
      <DateTimeSkeleton />

      {/* 3. Arena and Devices Skeleton */}
      <div className="flex flex-col gap-8 md:gap-10">
        {/* Arena selector */}
        <div>
          <Shimmer className="h-3 w-32 md:h-5 md:w-44 mb-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 md:max-w-[88%] gap-1.5 bg-foreground/8 dark:bg-foreground/5 border border-border rounded-[18px] p-1.5">
            <ArenaTabSkeleton />
            <ArenaTabSkeleton />
            <ArenaTabSkeleton />
            <ArenaTabSkeleton />
          </div>
          <ArenaInfoCardSkeleton />
        </div>

        {/* Device grid */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <Shimmer className="h-3 w-40 md:h-5 md:w-56" />
            <Shimmer className="h-3 w-20 md:h-3.5 md:w-24" />
          </div>
          <div className="max-h-105 overflow-hidden rounded-2xl border border-black/12 dark:border-border bg-foreground/1 dark:bg-muted/20 p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <DeviceCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <Shimmer className="h-3 w-56 mt-2.5" />
        </div>
      </div>
    </section>
  );
}
