import React from "react";
import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";
import { mockBookingReview } from "./review-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Review Your Booking | CTRL-CAFE",
  description:
    "Review your gaming stations, reserved time slot, and snack orders before completing your payment at CTRL-CAFE.",
};

type Props = {
  searchParams: Promise<{
    bookingId?: string;
  }>;
};

export default async function ReviewPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;
  if (!bookingId) {
    return redirect("/book");
  }
  return <ReviewClient data={mockBookingReview} />;
}
