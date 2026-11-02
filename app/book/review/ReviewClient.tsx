"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Gamepad2,
  Timer,
  Users,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBooking } from "@/app/book/Book-page-contaxt";
import type {
  BookingReviewData,
  DeviceReviewGroup,
  SnackReviewItem,
  StationReviewItem,
} from "./review-data";

/* Section: Player Dots Indicator */
export function PlayerDotsIndicator({
  current,
  max,
  className,
}: {
  current: number;
  max: number;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="meter"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${current} of ${max} players`}
    >
      {Array.from({ length: max }).map((_, idx) => {
        const isActive = idx < current;
        return (
          <span
            key={idx}
            className={cn(
              "size-2.5 rounded-full transition-all duration-200",
              isActive
                ? "bg-accent border border-amber-600/60 dark:border-accent shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                : "bg-muted-foreground/15 border border-muted-foreground/30 dark:bg-zinc-800 dark:border-zinc-700",
            )}
          />
        );
      })}
    </div>
  );
}

/* Section: Review Header */
export function ReviewHeader({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="mt-6 md:mt-8 mb-6 md:mb-8">
      {/* Top bar with Step badge & Cancel option */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className="size-1.5 rounded-full bg-accent" />
          Step 3 of 3 · Final Review
        </span>

        {/* Cancel Booking Action */}
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors py-1 px-2.5 rounded-lg hover:bg-destructive/10 cursor-pointer"
        >
          <XCircle className="size-3.5" />
          <span>Cancel booking</span>
        </button>
      </div>

      <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-tight">
        Review your booking<span className="text-accent">.</span>
      </h1>

      <p className="text-muted-foreground text-xs md:text-base mt-2 max-w-[46em] leading-relaxed">
        Check everything below. Payment opens in Razorpay when you tap Pay in the booking summary.
      </p>
    </div>
  );
}

/* Section: Date and Time */
export function DateTimeSection({
  schedule,
}: {
  schedule: BookingReviewData["schedule"];
}) {
  const items = [
    { label: "Date", value: schedule.dateFormatted, icon: Calendar },
    { label: "Starts", value: schedule.startsAt, icon: Clock },
    { label: "Ends", value: schedule.endsAt, icon: Clock },
    { label: "Duration", value: schedule.durationFormatted, icon: Timer },
    { label: "Players", value: `${schedule.totalPlayers}`, icon: Users },
  ];

  return (
    <section aria-labelledby="datetime-heading" className="space-y-3">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
          <Calendar className="size-4" />
        </div>
        <h2
          id="datetime-heading"
          className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
        >
          Date and time
        </h2>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-5 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-xl bg-background/70 dark:bg-zinc-900/40 border border-border/60 p-3.5 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <dt className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </dt>
                  <Icon className="size-3.5 text-muted-foreground/70" />
                </div>
                <dd className="font-heading text-base md:text-lg font-bold tracking-tight text-foreground tabular-nums">
                  {item.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

/* Section: Station Row */
export function StationRow({ station }: { station: StationReviewItem }) {
  const calculationFormula = `₹${station.ratePerPlayerPerHour} × ${station.players} player${
    station.players > 1 ? "s" : ""
  } × ${station.durationHours} hr`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1 transition-colors">
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="font-heading text-sm md:text-base font-bold text-foreground">
          {station.name}
        </span>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <PlayerDotsIndicator
              current={station.players}
              max={station.maxPlayers}
            />
            <span className="text-[12px] font-medium text-foreground/80 dark:text-muted-foreground">
              {station.players} of {station.maxPlayers} players
            </span>
          </div>

          <span className="hidden sm:inline text-border">·</span>

          <span className="font-mono text-[11px] rounded-md bg-muted/80 dark:bg-zinc-800/80 px-2 py-0.5 text-muted-foreground border border-border/50">
            {calculationFormula}
          </span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
        <span className="text-xs text-muted-foreground sm:hidden font-mono uppercase">
          Subtotal
        </span>
        <span className="font-heading text-base md:text-lg font-bold text-foreground tabular-nums">
          ₹{station.total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

/* Section: Devices */
export function DevicesSection({
  chips,
  groups,
  devicesTotal,
  totalPlayers,
}: {
  chips: BookingReviewData["deviceChips"];
  groups: DeviceReviewGroup[];
  devicesTotal: number;
  totalPlayers: number;
}) {
  return (
    <section aria-labelledby="devices-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
            <Gamepad2 className="size-4" />
          </div>
          <h2
            id="devices-heading"
            className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
          >
            Devices
          </h2>
        </div>

        {/* Summary Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-mono font-medium text-foreground"
            >
              <b className="font-bold text-accent-foreground dark:text-accent">
                {chip.count}×
              </b>{" "}
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-6 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none space-y-6">
        {groups.map((group) => (
          <div key={group.deviceTitle} className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2.5">
              <h3 className="font-heading text-base md:text-lg font-bold text-foreground">
                {group.deviceTitle}
              </h3>
              <span className="text-xs font-mono text-muted-foreground bg-muted/60 dark:bg-zinc-800/60 px-2.5 py-0.5 rounded-md border border-border/50">
                {group.hourlyRateText}
              </span>
            </div>

            <div className="divide-y divide-border/40">
              {group.stations.map((station) => (
                <StationRow key={station.id} station={station} />
              ))}
            </div>
          </div>
        ))}

        {/* Devices Summary Row */}
        <div className="rounded-xl bg-background/80 dark:bg-zinc-900/50 border border-border/80 p-4 mt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="size-3.5" /> Total players across stations
            </span>
            <span className="font-mono font-semibold text-foreground tabular-nums">
              {totalPlayers}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="font-heading text-sm md:text-base font-bold text-foreground">
              Devices Subtotal
            </span>
            <span className="font-heading text-lg md:text-xl font-black text-foreground tabular-nums">
              ₹{devicesTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Section: Snacks */
export function SnacksSection({
  snacks,
  snacksTotal,
}: {
  snacks: SnackReviewItem[];
  snacksTotal: number;
}) {
  const totalCount = snacks.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section aria-labelledby="snacks-heading" className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
            <UtensilsCrossed className="size-4" />
          </div>
          <h2
            id="snacks-heading"
            className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
          >
            Snacks
          </h2>
        </div>

        <span className="rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
          {totalCount} item{totalCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-6 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none space-y-4">
        {snacks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No snacks in this booking.
          </p>
        ) : (
          <div className="divide-y divide-border/40">
            {snacks.map((snack) => (
              <div
                key={snack.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/60">
                    <Image
                      src={snack.imageUrl || "/food-card-placeholder.webp"}
                      alt={snack.name}
                      fill
                      sizes="48px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-heading text-sm md:text-base font-bold text-foreground truncate">
                      {snack.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[11px] rounded-md bg-muted/80 dark:bg-zinc-800/80 px-2 py-0.5 text-muted-foreground border border-border/50">
                        {snack.quantity} × ₹{snack.pricePerUnit}
                      </span>
                      {snack.category && (
                        <span className="hidden sm:inline text-xs text-muted-foreground/70">
                          · {snack.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-heading text-base md:text-lg font-bold text-foreground tabular-nums">
                    ₹{snack.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl bg-background/80 dark:bg-zinc-900/50 border border-border/80 p-4 mt-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-sm md:text-base font-bold text-foreground">
              Snacks Subtotal
            </span>
            <span className="font-heading text-lg md:text-xl font-black text-foreground tabular-nums">
              ₹{snacksTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Section: Cancel Booking Confirmation / Footer Action */
export function CancelBookingFooter({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-background/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-0.5 text-center sm:text-left">
        <p className="font-heading text-sm font-bold text-foreground">
          Need to change your plan?
        </p>
        <p className="text-xs text-muted-foreground">
          Cancelling will release your reserved stations and return to the main booking screen.
        </p>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-4 py-2 text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95"
      >
        Cancel booking
      </button>
    </div>
  );
}

/* Section: Main Review Client Component */
export default function ReviewClient({ data }: { data: BookingReviewData }) {
  const router = useRouter();
  const { setSelectedDevices, setSelectedFoods } = useBooking();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  function handleCancelBooking() {
    // Clear booking state and route back to device selection
    setSelectedDevices([]);
    setSelectedFoods([]);
    router.push("/book");
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-12">
      <ReviewHeader onCancel={() => setShowConfirmModal(true)} />

      <DateTimeSection schedule={data.schedule} />

      <DevicesSection
        chips={data.deviceChips}
        groups={data.deviceGroups}
        devicesTotal={data.devicesTotal}
        totalPlayers={data.totalPlayers}
      />

      <SnacksSection
        snacks={data.snacks}
        snacksTotal={data.snacksTotal}
      />

      <CancelBookingFooter onCancel={() => setShowConfirmModal(true)} />

      {/* Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/15">
                <XCircle className="size-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Cancel this booking?
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to cancel your reserved stations and snacks?
              You will be redirected back to the device booking page.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="rounded-xl bg-destructive text-white px-4 py-2 text-xs font-bold hover:bg-destructive/90 transition-colors cursor-pointer"
              >
                Yes, cancel booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
