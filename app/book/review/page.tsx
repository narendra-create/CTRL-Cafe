import React from "react";
import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";
import { mockBookingReview } from "./review-data";
import { redirect } from "next/navigation";
import { cancelBooking } from "@/lib/controllers/bookingController";

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

  async function handleCancelBooking(bookingId: string) {
    try {
      const result = await cancelBooking(bookingId);
      if (!result.success) {
        return {
          success: false,
          message: result.message!,
        };
      }

      return result;
    } catch (err) {
      console.error("[handlecancelBooking]: ", err);
      return {
        success: false,
        message: "Something Went Wrong",
      };
    }
  }
  return (
    <ReviewClient
      data={mockBookingReview}
      bookingId={bookingId}
      onCancel={handleCancelBooking}
    />
  );
}
