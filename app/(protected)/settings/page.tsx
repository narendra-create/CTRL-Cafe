import { createClient } from "@/lib/supabase/serverClient";
import { getBookingHistory } from "@/lib/controllers/bookingController";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SettingsClient from "./SettingsClient";

async function getSettingsData() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  if (!claims) redirect("/auth/login");

  const email = claims.email ?? "";

  const rawProviders: unknown = claims.app_metadata?.providers;
  const providers: string[] = Array.isArray(rawProviders)
    ? (rawProviders as string[]).filter((p) => p !== "email")
    : [];

  const historyResult = await getBookingHistory();
  const bookingHistory = historyResult.success ? (historyResult.data ?? []) : [];

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
