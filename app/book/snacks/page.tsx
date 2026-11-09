import { redirect } from "next/navigation";
import SnacksClient from "./SnacksClient";

export default async function SnacksPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string | string[] }>;
}) {
  const { bookingId } = await searchParams;

  if (typeof bookingId !== "string" || !bookingId.trim()) {
    redirect("/book");
  }

  return <SnacksClient />;
}
