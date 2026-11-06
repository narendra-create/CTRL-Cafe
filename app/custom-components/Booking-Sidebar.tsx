"use client";
import React, { useState } from "react";
import { useBooking } from "@/app/book/Book-page-contaxt";
import { ARENAS } from "@/lib/static-data/Booking-data";
import { rupeesToPaise, toIndiaDateTime, toMinutes } from "@/lib/utils/tools";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  bookSeat,
  holdSeat,
  verifyPayment,
} from "@/lib/controllers/bookingController";
import {
  BookSeatInput,
  SeatHoldeInput,
} from "@/lib/validations/bookingValidation";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";

/* Section: Main Component */
export default function BookingSidebar() {
  const {
    setSelectedDevices,
    selectedDevices,
    startTime,
    endTime,
    selectedFoods,
    razorpayOrderId,
    setRazorpayOrderId,
    date,
  } = useBooking();

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

  // Price calculation becomes 3 clean lines:
  const devicePrices = selectedDevices.reduce(
    (sum, device) =>
      sum +
      Number(device.hourlyRate) *
        Number(device.players) *
        Number(durationHours),
    0,
  );

  const totalDevices = selectedDevices.length;
  const totalPlayers = selectedDevices.reduce((sum, d) => sum + d.players, 0);
  const foodItemPrices = selectedFoods.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const grandTotal = devicePrices + foodItemPrices;
  const canProceed = totalDevices > 0 && durationHours >= 0.5;

  function handleClearAll() {
    setSelectedDevices([]);
  }

  async function handleHold() {
    setpending(true);
    try {
      if (selectedDevices.length <= 0) {
        return;
      }
      const totalplayers = selectedDevices.reduce(
        (sum, d) => sum + d.players,
        0,
      );
      const payload: SeatHoldeInput = {
        gameStations: selectedDevices.map((d) => {
          return {
            playersCount: d.players,
            stationId: d.stationId,
          };
        }),
        playersCount: totalplayers,
        endTime: toIndiaDateTime(date, endTime),
        startTime: toIndiaDateTime(date, startTime),
      };
      const result = await holdSeat(payload);
      if (!result.success || !result.data) {
        seterror(result.message!);
        return;
      }

      router.push(`/book/snacks?bookingId=${result.data?.id ?? null}`);
    } catch (err) {
      seterror("Something Went wrong");
    } finally {
      setpending(false);
    }
  }

  async function handleBook() {
    setpending(true);
    if (!bookingId || bookingId.length === 0) {
      const msg = "Please Provide bookingId";
      seterror(msg);
      toast.add({ type: "error", title: "Missing Booking", description: msg });
      setpending(false);
      return;
    }
    // Safety check for Razorpay SDK availability
    if (typeof window === "undefined" || !(window as any).Razorpay) {
      const msg =
        "Payment gateway is still loading. Please try again in a few seconds.";
      seterror(msg);
      toast.add({
        type: "warning",
        title: "Please wait",
        description: msg,
      });
      setpending(false);
      return;
    }
    try {
      const payload: BookSeatInput = {
        bookingId: bookingId,
        foodItems: selectedFoods.map((food) => {
          return {
            foodItemId: food.id,
            qty: food.quantity,
          };
        }),
      };
      const result = await bookSeat(payload);
      if (!result.success || !result.data?.razorpay_orderId) {
        const msg =
          result.message ?? "Razorpay Order Id not found. Redirecting...";
        seterror(msg);
        toast.add({
          type: "error",
          title: "Booking Failed",
          description: msg,
        });
        return setTimeout(() => {
          router.push("/book");
        }, 5000);
      } else {
        const supabase = createClient();
        const claims = await supabase.auth.getClaims();
        if (!claims.data) {
          toast.add({
            type: "error",
            title: "Authentication Required",
            description: "Please sign in to complete your booking.",
          });
          return;
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: rupeesToPaise(result.data.updatedBooking.totalAmount),
          currency: "INR",
          name: "CTRL Cafe",
          description: "For booking Gaming sesssion",
          image: `${window.location.origin}/CTRL-CAFE-ICON.webp`,
          order_id: result.data.razorpay_orderId,
          prefill: {
            name: claims.data.claims.user_metadata?.full_name ?? "Gamer",
            email: claims.data.claims.email || "",
          },
          notes: {
            Slot: `${startTime} - ${endTime}`,
            Date: new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "2-digit",
              timeZone: "Asia/Kolkata",
            }),
          },
          theme: {
            color: "#fac800",
          },
          modal: {
            ondismiss: () => {
              setpending(false);
            },
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              setpending(true);
              const verification = await verifyPayment({
                bookingId: result.data?.updatedBooking.id ?? bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verification.success) {
                toast.add({
                  type: "success",
                  title: "Booking Confirmed!",
                  description:
                    "Your session and snacks are booked successfully.",
                });
                router.push(`/payment/success?bookingId=${bookingId}`);
              } else {
                const msg =
                  verification.message || "Payment verification failed.";
                seterror(msg);
                toast.add({
                  type: "error",
                  title: "Verification Failed",
                  description: msg,
                });
              }
            } catch {
              toast.add({
                type: "error",
                title: "Verification Error",
                description:
                  "An unexpected error occurred while verifying payment.",
              });
            } finally {
              setpending(false);
            }
          },
        };
        const razorpayClientForPayment = new (window as any).Razorpay(options);
        razorpayClientForPayment.on("payment.failed", (res: any) => {
          setpending(false);
          toast.add({
            type: "error",
            title: "Payment Failed",
            description:
              res.error?.description || "Payment could not be completed.",
          });
        });
        razorpayClientForPayment.open();
      }
    } catch (err) {
      const msg = "Something went wrong while initiating payment.";
      seterror(msg);
      toast.add({
        type: "error",
        title: "Error",
        description: msg,
      });
    } finally {
      setpending(false);
    }
  }

  async function handleProceed() {
    if (isReviewStep) {
      await handleBook();
    } else if (isFoodStep) {
      router.push(`/book/review?bookingId=${bookingId}`);
    } else {
      await handleHold();
    }
  }

  return (
    <>
      {/* Section: Desktop Sidebar Card */}
      <div className="lg:sticky lg:top-28 mb-5 md:mb-0 rounded-2xl border border-black/20 shadow-[0px_4px_10px_0px_#e2e8f0] dark:shadow-none dark:border-border bg-background overflow-hidden">
        {/* Razorpay CheckOut Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
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
          </div>
          <p className="text-[22px] md:text-2xl font-bold tracking-[-0.03em] leading-tight">
            {canProceed ? `₹${grandTotal}` : "₹0"}
          </p>
          <p className="text-[12px] md:text-[15px] text-foreground/60 dark:text-muted-foreground mt-1">
            {!canProceed
              ? totalDevices === 0
                ? "Pick a device to start"
                : "Minimum duration is 30 minutes"
              : `${totalDevices} device${totalDevices > 1 ? "s" : ""} · ${totalPlayers} player${totalPlayers > 1 ? "s" : ""} · ${durationHours} hr`}
          </p>
        </div>

        {/* Section: Sidebar Line Items */}
        <div className="px-5 py-4 min-h-[80px] border-t md:mt-3 md:pt-6 border-black/30 dark:border-foreground/30">
          {selectedDevices.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-4">
              No devices selected yet.
            </p>
          ) : (
            <ul className="grid gap-3 divide-y divide-black/25">
              {selectedDevices.map((device) => {
                const DeviceTotalPrice =
                  Number(device.hourlyRate) * Number(device.players);

                return (
                  <li
                    key={device.id}
                    className="flex items-start justify-between gap-3 pb-3"
                  >
                    <div>
                      <p className="text-[13px] md:text-lg font-bold">
                        {device.units} x {device.deviceName}
                      </p>
                      <p className="text-[11px] md:text-[12px] text-foreground/60 dark:text-muted-foreground mt-0.5">
                        {device.players} player{device.players > 1 ? "s" : ""} ·
                        ₹{device.hourlyRate}/hr each
                      </p>
                    </div>
                    <p className="text-[13px] md:text-lg font-bold shrink-0">
                      ₹{DeviceTotalPrice}
                    </p>
                  </li>
                );
              })}
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
          {error && (
            <p
              role="alert"
              className="mb-2 text-xs md:text-sm font-semibold text-destructive text-center"
            >
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed || pending}
            aria-busy={pending}
            className="w-full bg-accent text-accent-foreground rounded-xl py-3.5 text-[14px] font-bold cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {proceedLabel}
          </button>
          {!canProceed && (
            <p className="text-[11px] text-muted-foreground text-center mt-2.5">
              {totalDevices === 0
                ? "Select at least one device to continue"
                : "Minimum booking duration is 30 minutes"}
            </p>
          )}
        </div>
      </div>

      {/* Section: Mobile Summary Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 z-40">
        {error && (
          <p
            role="alert"
            className="mb-2 text-xs font-semibold text-destructive text-center"
          >
            {error}
          </p>
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[22px] font-[700] tracking-[-0.03em] leading-tight">
              {canProceed ? `₹${grandTotal}` : "₹0"}
            </p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              {!canProceed
                ? totalDevices === 0
                  ? "Pick a device to start"
                  : "Min. 30 mins duration"
                : `${totalDevices} device${totalDevices > 1 ? "s" : ""} · ${totalPlayers} player${totalPlayers > 1 ? "s" : ""} · ${durationHours} hr`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleProceed}
            disabled={!canProceed || pending}
            aria-busy={pending}
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
