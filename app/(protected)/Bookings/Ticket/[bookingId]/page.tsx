import React from "react";
import { redirect } from "next/navigation";
import {
  cancelBooking,
  getBookingDetails,
} from "@/lib/controllers/bookingController";
import { toast } from "@/components/ui/toast";
import { downloadBookingCalendar } from "@/lib/utils/tools";

type Props = {
  params: Promise<{
    bookingId?: string;
  }>;
};

const Ticket = async ({ params }: Props) => {
  const { bookingId } = await params;
  const value = bookingId;
  if (!value) {
    redirect("/Bookings/Current");
  }
  if (value.length <= 5) {
    return redirect("/Bookings/Current");
  }

  const result = await getBookingDetails({ bookingId });
  if (!result.success || !result.data) {
    toast.add({
      type: "error",
      description: `${result.message!}`,
    });
    setTimeout(() => {
      redirect("/Bookings/Current");
    }, 2000);
    return;
  }

  const handleCancelBooking = async () => {
    const result = await cancelBooking(bookingId);
    if (!result.success) {
      toast.add({
        type: "error",
        description: `${result.message!}`,
      });
      return {
        success: false,
      };
    } else {
      toast.add({
        type: "success",
        description: "Booking Cancelled",
      });
      return {
        success: true,
      };
    }
  };
  const bookingDetails = result.data;

  return (
    <main>
      <button onClick={() => downloadBookingCalendar(bookingDetails)}>
        Add to Calender
      </button>
      <button onClick={handleCancelBooking}>Cancel Booking</button>
    </main>
  );
};

export default Ticket;
