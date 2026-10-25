"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Terminal } from "lucide-react";

// Section: Types
export interface ComingSoonProps {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  statusPills?: string[];
  hotkey?: string;
  className?: string;
}

// Section: Component
export default function ComingSoon({
  badge = "STATION IN DEVELOPMENT",
  title = "This Station Is",
  titleHighlight = "Under Construction",
  titleSuffix = ".",
  subtitle = "We're currently configuring this zone. Our crew is tuning the rigs, setting up the menu, and calibrating the system. Check back soon or head back to the lobby.",
  primaryAction = {
    label: "Return to Lobby",
    href: "/",
  },
  secondaryAction = {
    label: "Book a Seat",
    href: "/book",
  },
  statusPills = [
    "Status: In Progress",
    "Area: Work In Progress",
    "Return: Check Back Soon",
  ],
  hotkey = "ENTER",
  className = "",
}: ComingSoonProps) {
  return (
    <section
      className={`relative w-full min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden bg-background text-foreground transition-colors selection:bg-accent selection:text-accent-foreground ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[350px] rounded-full bg-amber-500/12 dark:bg-yellow-500/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-5%] w-[450px] h-[300px] rounded-full bg-amber-600/10 dark:bg-yellow-600/8 blur-[120px]"
      />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-6 sm:gap-8">
        {/* Section: Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-600/25 dark:border-yellow-400/25 bg-amber-500/10 dark:bg-yellow-500/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-yellow-800 dark:text-yellow-400 uppercase tracking-[0.2em]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>{badge}</span>
            <Sparkles className="size-3.5 text-amber-600 dark:text-yellow-400" />
          </div>
        )}

        {/* Section: Heading */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] text-zinc-950 dark:text-zinc-50">
            {title}{" "}
            <mark className="inline-block -rotate-1 rounded-xl bg-accent px-3 sm:px-4 py-0.5 text-accent-foreground font-black shadow-[3px_3px_0_var(--foreground)]">
              {titleHighlight}
            </mark>
            {titleSuffix}
          </h1>

          {/* Section: Description */}
          {subtitle && (
            <p className="font-sans text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mt-2">
              {subtitle}
            </p>
          )}
        </div>

        {/* Section: Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-accent px-5 py-3 font-heading font-bold text-sm sm:text-base text-accent-foreground shadow-[3px_3px_0_var(--foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>{primaryAction.label}</span>
              </Link>
            )}

            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-sm px-5 py-3 font-heading font-semibold text-sm sm:text-base text-zinc-800 dark:text-zinc-200 hover:border-amber-500/50 dark:hover:border-yellow-400/50 hover:text-amber-700 dark:hover:text-yellow-400 transition-all"
              >
                <span>{secondaryAction.label}</span>
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        )}

        {/* Section: Status Pills */}
        {statusPills && statusPills.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {statusPills.map((pill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-xs font-mono text-zinc-600 dark:text-zinc-400"
              >
                <Terminal className="size-3 text-amber-600 dark:text-yellow-500" />
                <span>{pill}</span>
              </span>
            ))}
          </div>
        )}

        {/* Section: Hotkey Hint */}
        {hotkey && (
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400 pt-2">
            <kbd className="px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
              CTRL
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
              {hotkey}
            </kbd>
            <span className="ml-1 text-zinc-400 dark:text-zinc-500">
              • High frames, fresh brew, zero lag
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
