import React from "react";
import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";
import { mockBookingReview } from "./review-data";

export const metadata: Metadata = {
  title: "Review Your Booking | CTRL-CAFE",
  description:
    "Review your gaming stations, reserved time slot, and snack orders before completing your payment at CTRL-CAFE.",
};

export default function ReviewPage() {
  return <ReviewClient data={mockBookingReview} />;
}
