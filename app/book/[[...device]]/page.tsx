import BookingClient from "@/app/book/BookingClient";
import type { DeviceType } from "@/types/bookingTypes";

const VALID_DEVICES = new Set<DeviceType>(["CONSOLE", "PC", "ARCADE", "VR"]);

type Props = {
  params: Promise<{
    device?: string[];
  }>;
};

export default async function BookPage({ params }: Props) {
  const { device } = await params;
  const value = device?.[0]?.toUpperCase();

  const initialDevice = VALID_DEVICES.has(value as DeviceType)
    ? (value as DeviceType)
    : "CONSOLE";

  return <BookingClient initialDevice={initialDevice} />;
}
