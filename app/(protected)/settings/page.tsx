import { Suspense } from "react";
import { getBookingHistory } from "@/lib/controllers/bookingController";
import { getProfileDetails } from "@/lib/controllers/profileController";
import SettingsClient from "./SettingsClient";
import UnauthenticatedView from "./UnauthenticatedView";

/* Section: Settings Page Server Component */
export default async function SettingsPage() {
  const profileResult = await getProfileDetails();

  if (!profileResult.success || !profileResult.data) {
    return (
      <UnauthenticatedView
        message={profileResult.message || "Please log in to view your settings."}
      />
    );
  }

  const rawProviders: unknown = profileResult.providers;
  const providers: string[] = Array.isArray(rawProviders)
    ? (rawProviders as string[]).filter((p) => p !== "email")
    : [];

  const historyResult = await getBookingHistory();
  const bookingHistory = historyResult.success
    ? (historyResult.data ?? [])
    : [];

  return (
    <Suspense>
      <SettingsClient
        email={profileResult.email ?? ""}
        providers={providers}
        bookingHistory={bookingHistory}
        userDetails={profileResult.data}
      />
    </Suspense>
  );
}
