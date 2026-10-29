"use client";
import React, { useState } from "react";
import { useBooking } from "@/app/book/Book-page-contaxt";
import { ARENAS } from "@/lib/static-data/Booking-data";
import { toMinutes } from "@/lib/utils/tools";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* Section: Main Component */

export default function BookingSidebar() {
  const { allSelections, setAllSelections, startTime, endTime, selectedFoods } =
    useBooking();

  const [error, seterror] = useState<string | null>(null);
  const [pending, setpending] = useState(false);
  //defining some navigation things
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Getting booking id from params if it has it
  const bookingId = searchParams.get("bookingId");

  //Deciding the step
  const isFoodStep = pathname.startsWith("/book/snacks");
  const isReviewStep = pathname.startsWith("/book/review");

  const durationHours = Math.max(
    0,
    (toMinutes(endTime) - toMinutes(startTime)) / 60,
  );

  const proceedLabel = pending
    ? "Processing.."
    : isReviewStep
      ? "Pay Now"
      : isFoodStep
        ? "Review Booking"
        : "Proceed To Snacks";

  const lineItems = ARENAS.flatMap((arena) => {
    const sel = allSelections[arena.key] ?? {};
    const deviceIds = Object.keys(sel).map(Number);
    if (deviceIds.length === 0) return [];
    const totalPlayers = deviceIds.reduce((acc, id) => acc + sel[id], 0);
    const subtotal = deviceIds.length * arena.price * durationHours;
    return [
      {
        arena,
        deviceCount: deviceIds.length,
        totalPlayers,
        subtotal,
      },
    ];
  });
  const devicePrices = lineItems.reduce((acc, item) => acc + item.subtotal, 0);
  const foodItemPrices = selectedFoods.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const grandTotal = devicePrices + foodItemPrices;
  const totalDevices = lineItems.reduce(
    (acc, item) => acc + item.deviceCount,
    0,
  );

  const totalPlayers = lineItems.reduce(
    (acc, item) => acc + item.totalPlayers,
    0,
  );
  const canProceed = totalDevices > 0 && durationHours >= 0.5;

  function handleClearAll() {
    setAllSelections({});
  }

  async function handleProceed() {
    if (isReviewStep) {
      alert("Razorpay Opens");
    } else if (isFoodStep) {
      router.push("/book/review");
    } else {
      router.push("/book/snacks");
    }
  }

  return (
    <>
      {/* Section: Desktop Sidebar Card */}
      <div className="lg:sticky lg:top-28 mb-5 md:mb-0 rounded-2xl border border-black/20 shadow-[0px_4px_10px_0px_#e2e8f0] dark:shadow-none dark:border-border bg-background overflow-hidden">
        {/* Section: Sidebar Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-[10px] md:text-[15px] font-extrabold tracking-[0.11em] text-muted-foreground uppercase">
              Your booking
            </p>
            {canProceed && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-bold text-muted-foreground hover:text-destructive transition-colors duration-150 cursor-pointer"
              >
                Clear all
              </button>
            )}
            {error && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <p className="text-[22px] md:text-2xl font-bold tracking-[-0.03em] leading-tight">
            {canProceed ? `₹${grandTotal}` : "₹0"}
          </p>
          <p className="text-[12px] md:text-[15px] text-foreground/60 dark:text-muted-foreground mt-1">
            {!canProceed
              ? "Pick a device to start"
              : `${totalDevices} device${totalDevices > 1 ? "s" : ""} · ${totalPlayers} player${totalPlayers > 1 ? "s" : ""} · ${durationHours} hr`}
          </p>
        </div>

        {/* Section: Sidebar Line Items */}
        <div className="px-5 py-4 min-h-[80px] border-t md:mt-3 md:pt-6 border-black/30 dark:border-foreground/30">
          {lineItems.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-4">
              No devices selected yet.
            </p>
          ) : (
            <ul className="grid gap-3 divide-y divide-black/25">
              {lineItems.map(
                ({ arena, deviceCount, totalPlayers: pl, subtotal }) => (
                  <li
                    key={arena.key}
                    className="flex items-start justify-between gap-3 pb-3"
                  >
                    <div>
                      <p className="text-[13px] md:text-lg font-bold">
                        {deviceCount} x {arena.label}
                      </p>
                      <p className="text-[11px] md:text-[12px] text-foreground/60 dark:text-muted-foreground mt-0.5">
                        {pl} player{pl > 1 ? "s" : ""} · ₹{arena.price}/hr each
                      </p>
                    </div>
                    <p className="text-[13px] md:text-lg font-bold shrink-0">
                      ₹{subtotal}
                    </p>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
        <span
          className={`ml-5 text-lg font-bold tracking-wide text-accent ${selectedFoods.length === 0 && "hidden"}`}
        >
          - Snacks
        </span>
        <div className="px-5 py-4 min-h-[80px] border-t md:mt-3 md:pt-6 border-black/30 dark:border-foreground/30">
          {selectedFoods.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-4">
              No Snacks ? Huh
            </p>
          ) : (
            <ul className="grid gap-3 divide-y divide-black/25">
              {selectedFoods.map((food) => {
                const total = Number(food.price) * food.quantity;
                return (
                  <li
                    key={food.id}
                    className="flex items-start justify-between gap-3 pb-3"
                  >
                    <div>
                      <p className="text-[13px] md:text-lg font-bold">
                        {food.quantity} x {food.name}
                      </p>
                      <p className="text-[11px] md:text-[12px] text-foreground/60 dark:text-muted-foreground mt-0.5">
                        ₹{food.price}/Per Count
                      </p>
                    </div>
                    <p className="text-[13px] md:text-lg font-bold shrink-0">
                      ₹{total}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Section: Sidebar Stats */}
        {canProceed && (
          <div className="mx-5 mb-4 rounded-xl bg-muted/50 border border-black/30 dark:border-border px-4 py-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[18px] font-extrabold leading-tight">
                {totalDevices}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-[600] mt-0.5">
                Devices
              </p>
            </div>
            <div className="border-x border-black/30 dark:border-border">
              <p className="text-[18px] font-[800] leading-tight">
                {totalPlayers}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-[600] mt-0.5">
                Players
              </p>
            </div>
            <div>
              <p className="text-[18px] font-[800] leading-tight">
                {durationHours}h
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-[600] mt-0.5">
                Duration
              </p>
            </div>
          </div>
        )}

        {/* Section: Sidebar CTA */}
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full bg-accent text-accent-foreground rounded-xl py-3.5 text-[14px] font-[700] cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {proceedLabel}
          </button>
          {!canProceed && (
            <p className="text-[11px] text-muted-foreground text-center mt-2.5">
              Select at least one device to continue
            </p>
          )}
        </div>
      </div>

      {/* Section: Mobile Summary Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[22px] font-[700] tracking-[-0.03em] leading-tight">
              {canProceed ? `₹${grandTotal}` : "₹0"}
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {!canProceed
                ? "Pick a device to start"
                : `${totalDevices} device${totalDevices > 1 ? "s" : ""} · ${totalPlayers} player${totalPlayers > 1 ? "s" : ""} · ${durationHours} hr`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed}
            className="bg-accent text-accent-foreground rounded-xl px-5 py-3 text-[14px] font-[700] cursor-pointer transition-all duration-150 whitespace-nowrap disabled:opacity-35 disabled:cursor-not-allowed"
          >
            {proceedLabel}
          </button>
        </div>
      </div>
    </>
  );
}

export { BookingSidebar };
