import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface HookCardProps {
  accentText: string;
  title: string;
  description: string;
  rate?: string;
  tabs: [string, string?, string?, string?];
  bookingStyleText: string;
  deviceType: string;
  buttonHref: string;
}

const HookCard = ({
  accentText,
  title,
  description,
  rate,
  tabs,
  bookingStyleText,
  deviceType,
  buttonHref,
}: HookCardProps) => {
  return (
    // Card wrapper
    <section className="flex flex-col justify-between w-full rounded-xl overflow-hidden min-h-105 md:min-h-90 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800">
      {/* Top content */}
      <div className="px-6 pt-7 pb-0 flex flex-col gap-2">
        {/* Accent label + Rate */}
        <div className="flex items-start justify-between gap-4">
          <span className="text-yellow-700 dark:bg-clip-text dark:text-transparent dark:from-yellow-500 dark:via-yellow-600 dark:to-white bg-linear-to-r font-mono font-semibold text-xs tracking-[0.2em] uppercase">
            {accentText}
          </span>
          <div className="text-right shrink-0">
            <p className="text-yellow-700 dark:bg-clip-text dark:text-transparent dark:from-yellow-500 dark:to-yellow-200 bg-linear-to-r  font-heading font-bold text-2xl sm:text-3xl leading-none">
              {rate ?? "Affordable prices"}
            </p>
            {rate && (
              <p className="text-zinc-500 dark:text-zinc-300 text-xs font-sans mt-1 tracking-widest uppercase">
                /hour
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>

        {/* Description */}
        <p className="font-sans text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
          {description}
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2.5 mt-1">
          {tabs.filter(Boolean).map((tab) => (
            <span
              key={tab}
              className="border border-zinc-400 dark:border-zinc-600 text-zinc-800 dark:text-zinc-100 text-sm font-sans px-3.5 py-1.5 rounded-md"
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-8 px-6 pb-6 border-t border-zinc-300 dark:border-zinc-800 pt-5 flex items-end justify-between gap-4 flex-wrap">
        {/* Booking style */}
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 dark:text-zinc-500 md:font-medium md:text-[13px] font-mono text-[10px] tracking-[0.15em] uppercase">
            Booking Style
          </span>
          <p className="font-heading font-bold text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100">
            {bookingStyleText}
          </p>
        </div>

        {/* Book button */}
        <Link
          href={buttonHref}
          className="shrink-0 flex items-center gap-2.5 bg-accent hover:bg-accent/85 transition-all ease-out duration-200 hover:scale-105 hover:-translate-y-0.5 text-accent-foreground font-sans font-semibold text-sm sm:text-base px-5 py-3 rounded-lg"
        >
          Book {deviceType}
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
};

export default HookCard;
