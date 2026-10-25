"use client";

import { useEffect } from "react";
import Link from "next/link";
import { toast } from "@/components/ui/toast";

/* Section: Types */
type Props = {
  message?: string;
};

/* Section: Unauthenticated View Component */
export default function UnauthenticatedView({
  message = "Please log in to access your CTRL-CAFE settings.",
}: Props) {
  useEffect(() => {
    toast.add({
      type: "error",
      title: "Unauthenticated",
      description: message,
    });
  }, [message]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-[420px] rounded-[20px] border border-border bg-background p-7 md:p-9 text-center shadow-sm">
        {/* Section: Icon Badge */}
        <div className="size-14 mx-auto mb-5 rounded-full bg-accent/20 dark:bg-accent/15 border border-accent/30 flex items-center justify-center text-accent-foreground dark:text-accent">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Section: Copy */}
        <p className="text-[11px] font-[800] tracking-[0.14em] text-muted-foreground uppercase mb-1.5">
          Access Restricted
        </p>
        <h1 className="text-[22px] md:text-[24px] font-[800] tracking-tight mb-2">
          You are not logged in
        </h1>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-7">
          {message}
        </p>

        {/* Section: Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/login"
            className="flex-1 rounded-[10px] px-5 py-2.5 bg-[#202b29] dark:bg-accent text-white dark:text-accent-foreground text-[13px] font-[800] text-center transition-all duration-150 hover:-translate-y-px hover:shadow-md"
          >
            Log in
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-[10px] px-5 py-2.5 border border-border text-[13px] font-[700] text-muted-foreground hover:text-foreground hover:border-foreground/40 text-center transition-all duration-150"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
