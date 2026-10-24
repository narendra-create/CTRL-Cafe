"use client";

import { useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import { MotionConfig, motion } from "motion/react";

const display = Bricolage_Grotesque({ subsets: ["latin"] });
const hand = Caveat({ subsets: ["latin"], weight: "600" });

// Replace with a few real items from your food menu.
const SNACKS = ["Chips", "Cold drinks", "Noodles", "Sandwiches", "Popcorn"];

const MotionLink = motion.create(Link);

type SnacksSectionProps = {
  bookHref?: string;
};

export default function SnacksSection({ bookHref = "/book" }: SnacksSectionProps) {
  const [picked, setPicked] = useState<string[]>([]);

  function toggle(name: string) {
    setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  }

  const hint =
    picked.length === 0
      ? "tap what you’d grab"
      : `${picked.length} picked. Add ${picked.length === 1 ? "it" : "them"} when you book.`;

  return (
    <MotionConfig reducedMotion="user">
      <section className={`${display.className} text-foreground`}>
        {/* A cafe chalkboard: dark in both themes, so it reads as a different object from the paper card */}
        <div className="relative -rotate-[.6deg] rounded-2xl border-2 border-foreground bg-paper-foreground p-5 text-paper">
          <div className="pointer-events-none absolute inset-1.5 rounded-xl border border-dashed border-paper/25" />

          <h3 className={`${hand.className} text-[2rem] leading-none text-accent`}>Hungry mid-game?</h3>
          <p className="mt-2 mb-4 text-[.95rem] text-paper/80">
            Add snacks while you book a seat and pay for them online. Show your booking and get them between rounds.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {SNACKS.map((name) => {
              const on = picked.includes(name);
              return (
                <motion.button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(name)}
                  whileTap={{ scale: 0.94 }}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-semibold ${
                    on ? "border-accent bg-accent text-accent-foreground" : "border-dashed border-paper/40 text-paper"
                  }`}
                >
                  {on && (
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className="size-3 fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
                    >
                      <path d="M2 6.5l2.5 2.5L10 3.5" />
                    </svg>
                  )}
                  {name}
                </motion.button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className={`${hand.className} min-w-0 flex-1 text-[1.3rem] leading-tight text-paper/70`}>
              {hint}
            </p>
            <MotionLink
              href={bookHref}
              whileHover={{ x: -1, y: -1 }}
              whileTap={{ x: 3, y: 3 }}
              className="inline-block rounded-xl border-2 border-paper bg-accent px-3.5 py-2 text-sm font-bold text-accent-foreground shadow-[3px_3px_0_var(--paper)]"
            >
              Book a seat
            </MotionLink>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
