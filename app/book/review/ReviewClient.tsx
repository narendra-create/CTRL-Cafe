"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatTimeLabel } from "@/lib/utils/tools";
import {
  Calendar,
  Clock,
  Gamepad2,
  Timer,
  Users,
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Building2,
  XCircle,
  Monitor,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBooking } from "@/app/book/Book-page-contaxt";
import type {
  BookingReviewData,
  DeviceSetupCard,
  SnackVisualItem,
  RewardsSummary,
  RazorpayBriefing,
} from "./review-data";
import {
  DEVICE_STATIC,
  STATIC_REWARDS,
  STATIC_PAYMENT_BRIEFING,
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
      {/* Top status bar with Step badge & Cancel option */}
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
        Double check your rigs, food orders, and CTRL rewards below. Payment
        opens in Razorpay when you tap Pay in the booking summary.
      </p>
    </div>
  );
}

/* Section: Schedule & Arrival Briefing */
export function ScheduleBriefingCard({
  schedule,
}: {
  schedule: BookingReviewData["schedule"];
}) {
  const items = [
    { label: "Date", value: schedule.dateFormatted, icon: Calendar },
    {
      label: "Session Window",
      value: `${schedule.startsAt} – ${schedule.endsAt}`,
      icon: Clock,
    },
    { label: "Duration", value: schedule.durationFormatted, icon: Timer },
    {
      label: "Total Squad",
      value: `${schedule.totalPlayers} Players`,
      icon: Users,
    },
  ];

  return (
    <section aria-labelledby="schedule-heading" className="space-y-3">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
          <Calendar className="size-4" />
        </div>
        <h2
          id="schedule-heading"
          className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
        >
          Time & Arrival Pass
        </h2>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-5 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none space-y-4">
        {/* Facts Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-xl bg-background/70 dark:bg-zinc-900/40 border border-border/60 p-3.5 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <Icon className="size-3.5 text-muted-foreground/70" />
                </div>
                <span className="font-heading text-base md:text-lg font-bold tracking-tight text-foreground tabular-nums">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Arrival advisory callout */}
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-accent/60 bg-accent/10 px-4 py-3 text-xs text-foreground/90">
          <Clock className="size-4 text-accent-foreground dark:text-accent shrink-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-foreground">
              Front Desk Advisory:
            </span>{" "}
            {schedule.arrivalWindow}. Your stations will be powered up and
            pre-loaded with games.
          </p>
        </div>
      </div>
    </section>
  );
}

/* Section: Reserved Rigs & Station Setups */
export function DeviceSetupsVisual({ setups }: { setups: DeviceSetupCard[] }) {
  return (
    <section aria-labelledby="rigs-heading" className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
            <Gamepad2 className="size-4" />
          </div>
          <h2
            id="rigs-heading"
            className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
          >
            Reserved Gaming Pods & Rigs
          </h2>
        </div>

        <span className="rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
          {setups.reduce((sum, s) => sum + s.stations.length, 0)} Total Rigs
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {setups.map((setup) => (
          <div
            key={setup.id}
            className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-6 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
          >
            {/* Visual Cutout + Title */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative size-20 md:size-24 shrink-0 rounded-2xl bg-muted/60 dark:bg-zinc-900 border border-border/80 flex items-center justify-center p-2 overflow-hidden">
                <Image
                  src={setup.image}
                  alt={setup.title}
                  width={80}
                  height={80}
                  className="object-contain drop-shadow-md"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                    {setup.title}
                  </h3>
                  <span className="font-mono text-xs font-bold rounded-md bg-accent text-accent-foreground px-2 py-0.5">
                    {setup.count}× Setup{setup.count > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{setup.tagline}</p>

                {/* Specs / Included gear tags */}
                <ul className="flex flex-wrap gap-1.5 pt-1.5">
                  {setup.features.map((feat) => (
                    <li
                      key={feat}
                      className="inline-flex items-center gap-1 rounded-md bg-background/80 dark:bg-zinc-800/60 border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      <Check className="size-2.5 text-accent-foreground dark:text-accent" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stations list with player dots */}
            <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-5 space-y-2">
              <span className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Assigned Squad Stations
              </span>
              <div className="space-y-1.5">
                {setup.stations.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center justify-between md:justify-start gap-4 rounded-lg bg-background/80 dark:bg-zinc-900/60 border border-border/50 px-3 py-1.5 text-xs"
                  >
                    <span className="font-semibold text-foreground">
                      {station.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <PlayerDotsIndicator
                        current={station.players}
                        max={station.maxPlayers}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {station.players} of {station.maxPlayers}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Section: Snack Bar Orders with Item Images x Quantity */
export function SnackVisualCards({ snacks }: { snacks: SnackVisualItem[] }) {
  return (
    <section aria-labelledby="snacks-visual-heading" className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
            <UtensilsCrossed className="size-4" />
          </div>
          <h2
            id="snacks-visual-heading"
            className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
          >
            Snacks & Fuel (Delivered to Rigs)
          </h2>
        </div>

        <span className="rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
          {snacks.length} Item{snacks.length !== 1 ? "s" : ""} Selected
        </span>
      </div>

      {/* Visual Image x Quantity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {snacks.map((snack) => (
          <div
            key={snack.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-3.5 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none transition-all hover:border-accent/40"
          >
            {/* Image Container with Quantity Overlay */}
            <div className="relative h-36 w-full overflow-hidden rounded-xl bg-muted border border-border/50">
              <Image
                src={snack.imageUrl}
                alt={snack.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {/* Quantity Overlay Badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-accent text-accent-foreground px-2.5 py-1 text-xs font-black font-mono shadow-md">
                <span>{snack.quantity}×</span>
                <span className="text-[10px] font-sans font-bold uppercase">
                  Ordered
                </span>
              </div>

              {/* Servings badge */}
              <div className="absolute bottom-2.5 left-2.5 rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono text-white">
                {snack.serves}
              </div>
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {snack.category}
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">
                {snack.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {snack.prepNote}
              </p>
            </div>

            {/* Delivery note */}
            <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>Served directly to your rig</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Section: Rewards Earned After Payment */
export function RewardsEarnedCard({ rewards }: { rewards: RewardsSummary }) {
  const progressPercent = Math.round(
    (rewards.totalPointsEarned / rewards.goalForFreeHour) * 100,
  );

  return (
    <section aria-labelledby="rewards-heading" className="space-y-3">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
          <Sparkles className="size-4" />
        </div>
        <h2
          id="rewards-heading"
          className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
        >
          Rewards & Perks Earned
        </h2>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-border/80 bg-zinc-50/80 dark:bg-zinc-900/40 p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              CTRL Points Program
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl md:text-4xl font-black text-foreground">
                +{rewards.totalPointsEarned}
              </span>
              <span className="font-heading text-lg font-bold text-accent-foreground dark:text-accent">
                Points with this session
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Earned at {rewards.pointsPerHour} points/hour across{" "}
              {rewards.hoursBooked} hours of booked play.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-accent-foreground font-mono text-xs font-bold shadow-2xs">
            <Sparkles className="size-3.5" />
            <span>Instant Wallet Credit</span>
          </div>
        </div>

        {/* Free Hour Goal Bar */}
        <div className="space-y-2 rounded-xl bg-background/80 dark:bg-zinc-900/80 border border-border/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              Progress to 1 Free Gaming Hour
            </span>
            <span className="font-mono text-muted-foreground">
              {rewards.totalPointsEarned} / {rewards.goalForFreeHour} points (
              {progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-muted-foreground pt-0.5">
            You're just{" "}
            <span className="font-bold text-foreground">
              {rewards.pointsRemainingForFreeHour} more points
            </span>{" "}
            away from unlocking a completely free 1-hour gaming session.
          </p>
        </div>

        {/* Perks list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {rewards.perks.map((perk) => (
            <div
              key={perk}
              className="flex items-center gap-2 rounded-lg bg-background/60 dark:bg-zinc-900/40 border border-border/40 p-2.5 text-xs text-muted-foreground"
            >
              <Check className="size-3 text-emerald-500 shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Section: Razorpay Payment & Security Briefing */
export function RazorpayBriefingCard({
  payment,
}: {
  payment: RazorpayBriefing;
}) {
  return (
    <section aria-labelledby="razorpay-heading" className="space-y-3">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex size-7 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground dark:text-accent">
          <ShieldCheck className="size-4" />
        </div>
        <h2
          id="razorpay-heading"
          className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground uppercase"
        >
          Payment & Instant Station Lock
        </h2>
      </div>

      <div className="rounded-2xl border border-black/10 dark:border-border bg-card/60 dark:bg-card/30 p-4 md:p-6 shadow-[0px_4px_20px_0px_#00000008] dark:shadow-none space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground font-black font-heading text-sm">
              RZP
            </div>
            <div>
              <p className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                <span>Processed securely by {payment.provider}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {payment.encryption}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Payment opens instantly in the Razorpay popup when you tap Pay
                in the sidebar.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Payment Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {payment.supportedMethods.map((method, idx) => {
            const Icon =
              idx === 0 ? QrCode : idx === 1 ? CreditCard : Building2;
            return (
              <div
                key={method.category}
                className="rounded-xl bg-background/70 dark:bg-zinc-900/50 border border-border/60 p-3.5 space-y-1"
              >
                <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
                  <Icon className="size-3.5 text-accent-foreground dark:text-accent" />
                  <span>{method.category}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {method.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Guarantees checklist */}
        <div className="rounded-xl bg-muted/40 dark:bg-zinc-900/30 border border-border/50 p-3.5 space-y-1.5">
          {payment.guarantees.map((guarantee) => (
            <div
              key={guarantee}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
              <span>{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Section: Cancel Booking Banner Action */
export function CancelBookingFooter({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-background/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-0.5 text-center sm:text-left">
        <p className="font-heading text-sm font-bold text-foreground">
          Need to change your plan?
        </p>
        <p className="text-xs text-muted-foreground">
          Cancelling will release your reserved stations and return to the
          device selection screen.
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

export interface ReviewClientProps {
  onCancel: (
    bookingId: string,
  ) => Promise<{ success: boolean; message?: string }>;
  bookingId: string;
  currentPoints?: number;
}

/* Section: Main Review Client Component */
export default function ReviewClient({
  onCancel,
  bookingId,
  currentPoints = 0,
}: ReviewClientProps) {
  const router = useRouter();
  const { selectedDevices, selectedFoods, date, startTime, endTime } =
    useBooking();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  /* Section: Build dynamic BookingReviewData from context */
  const data: BookingReviewData = useMemo(() => {
    /* ── Schedule ── */
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    const dateFormatted = dateObj.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const durationHours = (endH * 60 + endM - (startH * 60 + startM)) / 60;

    const arrivalH = startH;
    const arrivalM = startM - 5 < 0 ? 55 : startM - 5;
    const arrivalDisplayH = arrivalH % 12 || 12;
    const arrivalPeriod = arrivalH >= 12 ? "PM" : "AM";
    const arrivalDisplay = `${arrivalDisplayH}:${String(arrivalM).padStart(2, "0")} ${arrivalPeriod}`;

    const totalPlayers = selectedDevices.reduce((s, d) => s + d.players, 0);

    /* ── Device Setups: group by deviceName ── */
    const groupsMap = new Map<
      string,
      { deviceType: string; deviceId: string; stations: typeof selectedDevices }
    >();

    for (const device of selectedDevices) {
      const key = device.deviceName;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          deviceType: device.deviceName.toUpperCase(),
          deviceId: device.deviceId,
          stations: [],
        });
      }
      groupsMap.get(key)!.stations.push(device);
    }

    const deviceSetups: DeviceSetupCard[] = Array.from(
      groupsMap.entries(),
    ).map(([name, group], groupIdx) => {
      /* Match to a known arena type for static metadata */
      const arenaKey = (["CONSOLE", "PC", "ARCADE", "VR"] as const).find(
        (k) => group.deviceType.includes(k),
      ) ?? "CONSOLE";
      const staticMeta = DEVICE_STATIC[arenaKey];

      return {
        id: `device-group-${groupIdx}`,
        deviceType: arenaKey,
        title: name,
        count: group.stations.length,
        image: staticMeta.image,
        tagline: staticMeta.tagline,
        features: staticMeta.features,
        stations: group.stations.map((s, stIdx) => ({
          id: s.stationId,
          name: s.stationLabel || `Station ${stIdx + 1}`,
          stationNumber: stIdx + 1,
          players: s.players,
          maxPlayers: s.maxPlayers,
        })),
      };
    });

    /* ── Snacks: map context food items ── */
    const snacks: SnackVisualItem[] = selectedFoods.map((food) => ({
      id: food.id,
      name: food.name,
      quantity: food.quantity,
      serves: `Serves ${food.serves}`,
      category: food.name,
      imageUrl: food.imageUrl ?? "/food-card-placeholder.webp",
      prepNote: food.description ?? "Freshly prepared and delivered to your rig",
    }));

    /* ── Rewards: driven by currentPoints prop ── */
    const totalPointsEarned = Math.floor(
      durationHours * STATIC_REWARDS.pointsPerHour,
    );
    const pointsRemainingForFreeHour = Math.max(
      0,
      STATIC_REWARDS.goalForFreeHour - currentPoints,
    );

    return {
      schedule: {
        dateFormatted,
        isoDate: date,
        startsAt: formatTimeLabel(startTime),
        endsAt: formatTimeLabel(endTime),
        durationFormatted:
          durationHours === 1
            ? "1 hour"
            : `${durationHours} hour${durationHours !== 1 ? "s" : ""}`,
        durationHours,
        totalPlayers,
        arrivalWindow: `Check-in at front desk 5 mins prior (${arrivalDisplay})`,
      },
      deviceSetups,
      snacks,
      rewards: {
        currentPoints,
        pointsPerHour: STATIC_REWARDS.pointsPerHour,
        hoursBooked: durationHours,
        totalPointsEarned,
        goalForFreeHour: STATIC_REWARDS.goalForFreeHour,
        pointsRemainingForFreeHour,
        perks: [...STATIC_REWARDS.perks],
      },
      paymentBriefing: STATIC_PAYMENT_BRIEFING,
    };
  }, [selectedDevices, selectedFoods, date, startTime, endTime, currentPoints]);

  async function handleCancelBooking() {
    setIsCancelling(true);
    setCancelError(null);
    const result = await onCancel(bookingId);
    if (!result.success) {
      setCancelError(result.message || "Failed to cancel booking. Please try again.");
      setIsCancelling(false);
      return;
    }
    router.push("/book");
  }

  function openConfirmModal() {
    setCancelError(null);
    setShowConfirmModal(true);
  }

  function closeConfirmModal() {
    setCancelError(null);
    setShowConfirmModal(false);
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-12">
      <ReviewHeader onCancel={openConfirmModal} />

      <ScheduleBriefingCard schedule={data.schedule} />

      <DeviceSetupsVisual setups={data.deviceSetups} />

      {data.snacks.length > 0 && (
        <SnackVisualCards snacks={data.snacks} />
      )}

      <RewardsEarnedCard rewards={data.rewards} />

      <RazorpayBriefingCard payment={data.paymentBriefing} />

      <CancelBookingFooter onCancel={openConfirmModal} />

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

            {cancelError && (
              <p role="alert" className="text-xs font-semibold text-destructive">
                {cancelError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeConfirmModal}
                disabled={isCancelling}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="rounded-xl bg-destructive text-white px-4 py-2 text-xs font-bold hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, cancel booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

