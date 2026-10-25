import { getBookingHistory } from "@/lib/controllers/bookingController";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SettingsClient from "@/app/(protected)/settings/SettingsClient";
import { getProfileDetails } from "@/lib/controllers/profileController";

async function getSettingsData() {
  const profileResult = await getProfileDetails();
  if (!profileResult.success) {
  }
  const userData = profileResult;
  if (!userData.email) redirect("/auth/login");
  const email = userData.email ?? "";

  const rawProviders: unknown = userData.providers;
  const providers: string[] = Array.isArray(rawProviders)
    ? (rawProviders as string[]).filter((p) => p !== "email")
    : [];

  const historyResult = await getBookingHistory();
  const bookingHistory = historyResult.success
    ? (historyResult.data ?? [])
    : [];

  return { email, providers, bookingHistory };
}

export default async function SettingsPage() {
  const data = await getSettingsData();
  return (
    <Suspense>
      <SettingsClient {...data} />
    </Suspense>
  );
}
