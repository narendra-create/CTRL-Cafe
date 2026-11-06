import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FailurePageProps = {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<{
    bookingId?: string;
    message?: string;
  }>;
  bookingId?: string;
  message?: string;
};

export default async function PaymentFailurePage(props: FailurePageProps) {
  const resolvedSearchParams = props.searchParams ? await props.searchParams : {};
  const bookingId = props.bookingId ?? resolvedSearchParams.bookingId;
  const displayMessage =
    props.message ??
    resolvedSearchParams.message ??
    "We could not complete your payment. Any deducted funds will be reversed to your original payment method.";

  return (
    <main className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-24 pt-28 md:pt-36">
      {/* Section: Status Card */}
      <div className="w-full max-w-md rounded-3xl border border-destructive/20 bg-card/70 dark:bg-card/40 backdrop-blur-md p-6 sm:p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none space-y-6">
        {/* Section: Failure Icon */}
        <div className="size-16 sm:size-20 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(239,68,68,0.15)]">
          <X className="size-8 sm:size-10 stroke-[2.5]" />
        </div>

        {/* Section: Heading & Message */}
        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Payment Failed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {displayMessage}
          </p>
        </div>

        {/* Section: Booking Reference */}
        {bookingId && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-destructive/5 border border-destructive/20 text-xs font-mono text-destructive">
            <span className="opacity-80">Booking ID:</span>
            <span className="font-semibold truncate max-w-[190px]">
              {bookingId}
            </span>
          </div>
        )}

        {/* Section: Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/book" className="flex-1">
            <Button
              variant="destructive"
              className="w-full h-11 font-medium rounded-xl cursor-pointer"
            >
              Book fresh session
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl cursor-pointer"
            >
              Go to home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
