"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  cancelBooking,
  getBookingDetails,
} from "@/lib/controllers/bookingController";
import { toast } from "@/components/ui/toast";
import { downloadBookingCalendar } from "@/lib/utils/tools";
import BookingTicketCard, {
  TicketCardProps,
} from "@/app/custom-components/cards/BookingTicketCard";
import type { BookingDetailsData } from "@/types/bookingTypes";
import { Calendar, Coffee, Headphones, Loader2, Wifi } from "lucide-react";

/* Section: Types */
type Props = {
  params: Promise<{
    bookingId?: string;
  }>;
};

type CountdownState = {
  hours: string;
  minutes: string;
  seconds: string;
  isLive: boolean;
  isEnded: boolean;
};

// const mockBooking: BookingDetailsData = {
//   id: "test_booking_123",
//   status: "confirmed",

//   startTime: new Date("2026-11-20T15:00:00+05:30"),
//   endTime: new Date("2026-11-20T17:00:00+05:30"),

//   totalAmount: "500",
//   playersCount: 2,
//   holdExpiresAt: null,
//   razorpayOrderId: "order_test_123",

//   deviceName: "PS5 Gaming",
//   hourlyRate: "250",

//   foodItems: [
//     {
//       name: "Cold Coffee",
//       qty: 2,
//       unitPrice: "80",
//     },
//   ],
// };

/* Section: Main Component */
const TicketPage = ({ params }: Props) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const bookingId = resolvedParams.bookingId;

  const [bookingDetails, setBookingDetails] =
    useState<BookingDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    isLive: false,
    isEnded: false,
  });

  /* Section: Data Fetching */
  useEffect(() => {
    let isMounted = true;

    async function fetchDetails() {
      if (!bookingId || bookingId.length <= 5) {
        router.push("/Bookings/Current");
        return;
      }

      try {
        const result = await getBookingDetails({ bookingId });
        if (!result.success || !result.data) {
          toast.add({
            type: "error",
            description: `${result.message || "Booking not found"}`,
          });
          setTimeout(() => {
            router.push("/Bookings/Current");
          }, 2000);
          return;
        }

        if (isMounted) {
          setBookingDetails(result.data);
          setIsLoading(false);
        }
      } catch (err) {
        toast.add({
          type: "error",
          description: "Something went wrong loading booking",
        });
        setTimeout(() => {
          router.push("/Bookings/Current");
        }, 2000);
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [bookingId, router]);

  /* Section: Countdown Calculation */
  useEffect(() => {
    if (!bookingDetails?.startTime) return;

    function calculateTime() {
      const now = new Date().getTime();
      const start = new Date(bookingDetails!.startTime).getTime();
      const end = new Date(bookingDetails!.endTime).getTime();
      const diff = start - now;

      if (diff <= 0) {
        if (now <= end) {
          setTimeLeft({
            hours: "00",
            minutes: "00",
            seconds: "00",
            isLive: true,
            isEnded: false,
          });
        } else {
          setTimeLeft({
            hours: "00",
            minutes: "00",
            seconds: "00",
            isLive: false,
            isEnded: true,
          });
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isLive: false,
        isEnded: false,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [bookingDetails]);

  /* Section: Handlers */
  const handleCancelBooking = async () => {
    if (!bookingId || isCancelling) return;
    setIsCancelling(true);

    try {
      const result = await cancelBooking(bookingId);
      if (!result.success) {
        toast.add({
          type: "error",
          description: `${result.message!}`,
        });
        return { success: false };
      } else {
        toast.add({
          type: "success",
          description: "Booking Cancelled",
        });
        setTimeout(() => {
          router.push("/Bookings/Current");
        }, 1500);
        return { success: true };
      }
    } catch {
      toast.add({
        type: "error",
        description: "Failed to cancel booking",
      });
      return { success: false };
    } finally {
      setIsCancelling(false);
    }
  };

  /* Section: Loading State */
  if (isLoading || !bookingDetails) {
    return (
      <main className="min-h-screen pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-amber-500" />
          <p className="font-heading font-bold text-base md:text-lg text-muted-foreground">
            Loading your booking pass...
          </p>
        </div>
      </main>
    );
  }

  /* Section: Ticket Props Mapping */
  const ticketProps: TicketCardProps = {
    startTime: bookingDetails.startTime,
    endTime: bookingDetails.endTime,
    isRewardGranted: true,
    paidAmount: bookingDetails.totalAmount,
    bookingId: bookingDetails.id,
    razorpayOrderId: bookingDetails.razorpayOrderId || "pay_verified",
    bookedStations: [
      {
        parentdevicename: bookingDetails.deviceName,
        stationlabel: "Station 1",
        stationplayers: bookingDetails.playersCount,
      },
    ],
    orderedSnacks:
      bookingDetails.foodItems?.map((food) => ({
        snackname: food.name,
        qty: food.qty,
      })) || [],
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* Section: Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground">
              Current booking
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-sm sm:text-base font-bold font-heading uppercase tracking-wide text-foreground">
                Confirmed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <button
              type="button"
              onClick={() => downloadBookingCalendar(bookingDetails)}
              className="rounded-full border border-border bg-card px-5 py-2.5 font-heading font-bold text-sm md:text-base text-foreground hover:bg-muted transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
            >
              <Calendar className="size-4" />
              <span>Add to calendar</span>
            </button>
            <button
              type="button"
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="font-heading font-bold text-sm md:text-base text-foreground/80 hover:text-destructive underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isCancelling && <Loader2 className="size-4 animate-spin" />}
              <span>Cancel booking</span>
            </button>
          </div>
        </div>

        {/* Section: Ticket Card */}
        <div className="w-full">
          <BookingTicketCard Props={ticketProps} />
        </div>

        {/* Section: Information Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Section: Countdown Widget */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs md:text-sm font-extrabold font-heading uppercase tracking-widest text-muted-foreground mb-3">
                Starts in
              </p>
              {timeLeft.isLive ? (
                <div className="flex items-center gap-2.5 py-2">
                  <span className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-2xl md:text-3xl font-black font-heading text-emerald-500">
                    Session Live
                  </h3>
                </div>
              ) : timeLeft.isEnded ? (
                <div className="py-2">
                  <h3 className="text-2xl md:text-3xl font-black font-heading text-muted-foreground">
                    Session Ended
                  </h3>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-2.5 text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground">
                    <span>{timeLeft.hours}</span>
                    <span className="text-muted-foreground/60">:</span>
                    <span>{timeLeft.minutes}</span>
                    <span className="text-muted-foreground/60">:</span>
                    <span>{timeLeft.seconds}</span>
                  </div>
                  <div className="flex items-center gap-7 text-xs font-bold font-heading uppercase tracking-widest text-muted-foreground mt-2 pl-1">
                    <span>hr</span>
                    <span>min</span>
                    <span>sec</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Check In Widget */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs md:text-sm font-extrabold font-heading uppercase tracking-widest text-muted-foreground mb-4">
                Check in
              </p>
              <ul className="flex flex-col gap-3.5">
                <li className="flex items-start gap-3">
                  <span className="size-6 shrink-0 rounded-full border border-border bg-muted flex items-center justify-center text-xs font-black font-heading text-foreground mt-0.5">
                    1
                  </span>
                  <p className="text-sm md:text-base font-medium text-foreground/90 leading-snug">
                    Show the QR code at the counter.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-6 shrink-0 rounded-full border border-border bg-muted flex items-center justify-center text-xs font-black font-heading text-foreground mt-0.5">
                    2
                  </span>
                  <p className="text-sm md:text-base font-medium text-foreground/90 leading-snug">
                    Staff scan it and send you to your stations.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="size-6 shrink-0 rounded-full border border-border bg-muted flex items-center justify-center text-xs font-black font-heading text-foreground mt-0.5">
                    3
                  </span>
                  <p className="text-sm md:text-base font-medium text-foreground/90 leading-snug">
                    Show the same pass to collect your food during the session.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Section: Rewards Widget */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col justify-between gap-5">
            <div>
              <p className="text-xs md:text-sm font-extrabold font-heading uppercase tracking-widest text-muted-foreground mb-3">
                Rewards
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl md:text-5xl font-black font-heading text-foreground">
                  55
                </span>
                <span className="text-sm md:text-base font-bold font-heading text-muted-foreground">
                  of 65 points
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 dark:bg-yellow-400 transition-all duration-500"
                  style={{ width: `${Math.min((55 / 65) * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground leading-relaxed">
              10 points earned with this booking. 10 more for a free hour.
            </p>
          </div>
        </div>

        {/* Section: Amenities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8 mt-2">
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="size-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Wifi className="size-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-foreground">
                Gigabit Wi-Fi
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Free high-speed access
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="size-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Headphones className="size-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-foreground">
                Pro Peripherals
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Sanitized before every session
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="size-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Coffee className="size-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-foreground">
                Station Service
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Food served directly to your rig
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TicketPage;
