/* Section: Shimmer Base */

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-muted ${className ?? ""}`} />
  );
}

/* Section: Section Header Skeleton */

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2 pb-1">
      <div className="size-7 rounded-lg bg-muted animate-pulse shrink-0" />
      <Shimmer className="h-5 w-48 md:h-6 md:w-64" />
    </div>
  );
}

/* Section: Review Header Skeleton */

function ReviewHeaderSkeleton() {
  return (
    <div className="mt-6 md:mt-8 mb-6 md:mb-8">
      {/* Step badge + cancel button row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <Shimmer className="h-6 w-44 rounded-full" />
        <Shimmer className="h-6 w-28 rounded-lg" />
      </div>

      {/* Title */}
      <Shimmer className="h-9 w-64 md:h-16 md:w-[520px] lg:h-20 lg:w-[600px]" />

      {/* Subtitle */}
      <div className="flex flex-col gap-1.5 mt-2">
        <Shimmer className="h-3 w-72 md:h-4 md:w-[480px]" />
        <Shimmer className="h-3 w-56 md:hidden" />
      </div>
    </div>
  );
}

/* Section: Schedule Briefing Card Skeleton */

function ScheduleBriefingCardSkeleton() {
  return (
    <section className="space-y-3">
      <SectionHeaderSkeleton />

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-5 space-y-4">
        {/* Facts grid — 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-xl bg-background/70 dark:bg-zinc-900/40 border border-border/60 p-3.5 gap-3"
            >
              <div className="flex items-center justify-between gap-1">
                <Shimmer className="h-2.5 w-16" />
                <Shimmer className="size-3.5 rounded-sm" />
              </div>
              <Shimmer className="h-5 w-24 md:h-6 md:w-28" />
            </div>
          ))}
        </div>

        {/* Arrival advisory callout */}
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-accent/40 bg-accent/10 px-4 py-3">
          <Shimmer className="size-4 rounded-sm shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Shimmer className="h-3 w-full max-w-sm" />
            <Shimmer className="h-3 w-3/4 max-w-xs" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Section: Device Rig Card Skeleton */

function DeviceRigCardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-6 shadow-none flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
      {/* Image + title block */}
      <div className="flex items-start sm:items-center gap-4">
        <div className="size-20 md:size-24 shrink-0 rounded-2xl bg-muted animate-pulse" />

        <div className="space-y-2">
          {/* Title + badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Shimmer className="h-5 w-32 md:h-6 md:w-40" />
            <Shimmer className="h-5 w-16 rounded-md" />
          </div>
          <Shimmer className="h-3 w-40" />

          {/* Feature tags */}
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            <Shimmer className="h-5 w-20 rounded-md" />
            <Shimmer className="h-5 w-16 rounded-md" />
            <Shimmer className="h-5 w-24 rounded-md" />
          </div>
        </div>
      </div>

      {/* Station rows */}
      <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-5 space-y-2">
        <Shimmer className="h-2.5 w-36 mb-1" />
        <div className="space-y-1.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-lg bg-background/80 dark:bg-zinc-900/60 border border-border/50 px-3 py-1.5"
            >
              <Shimmer className="h-3.5 w-20" />
              <div className="flex items-center gap-2">
                {/* Player dots */}
                <div className="inline-flex gap-1.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="size-2.5 rounded-full bg-muted animate-pulse"
                    />
                  ))}
                </div>
                <Shimmer className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Section: Device Setups Visual Skeleton */

function DeviceSetupsVisualSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <SectionHeaderSkeleton />
        <Shimmer className="h-5 w-20 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DeviceRigCardSkeleton />
        <DeviceRigCardSkeleton />
      </div>
    </section>
  );
}

/* Section: Snack Visual Card Skeleton */

function SnackCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-3.5">
      {/* Image placeholder */}
      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-muted border border-border/50 animate-pulse">
        {/* Quantity badge */}
        <div className="absolute top-2.5 left-2.5">
          <Shimmer className="h-6 w-16 rounded-lg" />
        </div>
        {/* Serves badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <Shimmer className="h-4 w-14 rounded-md" />
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        <Shimmer className="h-2.5 w-16" />
        <Shimmer className="h-4 w-32 md:h-5" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>

      {/* Delivery note */}
      <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center gap-1.5">
        <Shimmer className="size-3 rounded-full" />
        <Shimmer className="h-3 w-36" />
      </div>
    </div>
  );
}

/* Section: Snack Visual Cards Skeleton */

function SnackVisualCardsSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <SectionHeaderSkeleton />
        <Shimmer className="h-5 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SnackCardSkeleton />
        <SnackCardSkeleton />
        <SnackCardSkeleton />
      </div>
    </section>
  );
}

/* Section: Rewards Earned Card Skeleton */

function RewardsEarnedCardSkeleton() {
  return (
    <section className="space-y-3">
      <SectionHeaderSkeleton />

      <div className="rounded-2xl border-2 border-dashed border-border/80 bg-zinc-50/80 dark:bg-zinc-900/40 p-5 md:p-6 space-y-5">
        {/* Points block + badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Shimmer className="h-2.5 w-32" />
            <div className="flex items-baseline gap-2">
              <Shimmer className="h-9 w-16 md:h-11 md:w-20" />
              <Shimmer className="h-5 w-40 md:h-6 md:w-48" />
            </div>
            <Shimmer className="h-3 w-56" />
          </div>
          <Shimmer className="h-8 w-36 rounded-xl" />
        </div>

        {/* Progress bar block */}
        <div className="space-y-2 rounded-xl bg-background/80 dark:bg-zinc-900/80 border border-border/60 p-4">
          <div className="flex items-center justify-between">
            <Shimmer className="h-3 w-44" />
            <Shimmer className="h-3 w-28" />
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-2/5 rounded-full bg-muted-foreground/20 animate-pulse" />
          </div>
          <Shimmer className="h-3 w-64" />
        </div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg bg-background/60 dark:bg-zinc-900/40 border border-border/40 p-2.5"
            >
              <Shimmer className="size-3 rounded-full shrink-0" />
              <Shimmer className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Section: Razorpay Briefing Card Skeleton */

function RazorpayBriefingCardSkeleton() {
  return (
    <section className="space-y-3">
      <SectionHeaderSkeleton />

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-6 space-y-5">
        {/* Provider row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Shimmer className="h-4 w-40" />
                <Shimmer className="h-4 w-20 rounded-md" />
              </div>
              <Shimmer className="h-3 w-56" />
            </div>
          </div>
        </div>

        {/* Payment method cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-background/70 dark:bg-zinc-900/50 border border-border/60 p-3.5 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Shimmer className="size-3.5 rounded-sm" />
                <Shimmer className="h-3 w-20" />
              </div>
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-4/5" />
            </div>
          ))}
        </div>

        {/* Guarantees checklist */}
        <div className="rounded-xl bg-muted/40 dark:bg-zinc-900/30 border border-border/50 p-3.5 space-y-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Shimmer className="size-3.5 rounded-full shrink-0" />
              <Shimmer className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Section: Cancel Footer Skeleton */

function CancelBookingFooterSkeleton() {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-background/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1.5 text-center sm:text-left">
        <Shimmer className="h-4 w-40 mx-auto sm:mx-0" />
        <Shimmer className="h-3 w-64 mx-auto sm:mx-0" />
      </div>
      <Shimmer className="h-8 w-32 rounded-xl shrink-0" />
    </div>
  );
}

/* Section: Main Export */

export default function ReviewPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-12">
      <ReviewHeaderSkeleton />
      <ScheduleBriefingCardSkeleton />
      <DeviceSetupsVisualSkeleton />
      <SnackVisualCardsSkeleton />
      <RewardsEarnedCardSkeleton />
      <RazorpayBriefingCardSkeleton />
      <CancelBookingFooterSkeleton />
    </div>
  );
}
