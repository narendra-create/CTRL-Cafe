import type { Metadata } from "next";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const hand = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: "Membership Plans | CTRL-CAFE",
  description:
    "We are currently designing our membership plans. In the meantime, all gaming stations are open for hourly bookings at CTRL-CAFE.",
};

const BOOK_HREF = "/book";
const PRICES_HREF = "/Prices";

export default function PlansPage() {
  return (
    <main className="w-full mt-15 md:mt-16 overflow-x-hidden">
      <div className="w-full px-5 pt-10 pb-16 sm:px-8 lg:px-22 lg:pt-16 lg:pb-24 xl:px-26">
        {/* Header */}
        <header className="mb-16 max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              CTRL-CAFE // Memberships
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            <span
              className={`${hand.className} text-xl text-yellow-800 dark:text-yellow-400 rotate-[-2deg]`}
            >
              in the works!
            </span>
          </div>

          <h1 className="font-heading text-4xl leading-[1.02] font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Play every day,{" "}
            <span className="relative inline-block whitespace-nowrap">
              pay once
              <svg
                aria-hidden="true"
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent"
              >
                <path
                  d="M2 9C30 2 55 14 85 7S140 3 170 8 230 13 260 6 290 4 298 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Buying hours one by one gets annoying when you're here every evening.
            We're building flexible membership plans that actually make financial sense
            for regulars. Until the tiers are locked in, our stations run on
            simple hourly booking.
          </p>
        </header>

        {/* The Two Halves: Current vs What's Next */}
        <section
          aria-label="Membership overview"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 border-t-2 border-border pt-12 lg:pt-16"
        >
          {/* Left: How it works today */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-border pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Status // Live Today
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Hourly booking open
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                Pay as you play.
              </h2>

              <p className="font-sans text-base text-muted-foreground leading-relaxed">
                Zero commitments, no monthly debit surprises, and no upfront subscriptions.
                Drop by, pick your rig, and game for as long as you want.
              </p>

              <ul className="space-y-4 pt-2 font-sans text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded mt-0.5">
                    01
                  </span>
                  <span>
                    Transparent rates starting from ₹50/hr across PC, PS5, Arcade & VR.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded mt-0.5">
                    02
                  </span>
                  <span>
                    Earn 10 CTRL points for every hour played — 65 points gets you a free hour.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded mt-0.5">
                    03
                  </span>
                  <span>
                    Order snacks and cold brew directly to your rig while playing.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={BOOK_HREF}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-foreground bg-accent px-6 py-3.5 font-heading text-base font-bold text-accent-foreground shadow-[3px_3px_0_var(--foreground)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                <span>Book an hourly seat</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={PRICES_HREF}
                className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                <span>Check device prices</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: What we're cooking */}
          <div className="flex flex-col justify-between space-y-8 rounded-2xl border-2 border-dashed border-foreground/30 bg-zinc-50/60 dark:bg-zinc-900/40 p-7 sm:p-10 relative">
            {/* Tilted note stamp */}
            <div className="absolute -top-4 right-6 sm:right-10 rotate-3">
              <span className="inline-block rounded-md border-2 border-foreground bg-accent px-3 py-1 font-heading text-xs font-black uppercase tracking-wider text-accent-foreground shadow-[2px_2px_0_var(--foreground)]">
                Coming In Updates
              </span>
            </div>

            <div className="space-y-6">
              <div className="border-b border-dashed border-foreground/20 pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Under Construction
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                What memberships will look like.
              </h2>

              <p className="font-sans text-base text-muted-foreground leading-relaxed">
                We're testing different formats with our regulars to see what feels right:
              </p>

              <div className="space-y-5 pt-2">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Daily game time allowances
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    A fixed daily allotment of hours deposited into your account every morning. No checkout screen needed.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Priority reservation windows
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    First pick on weekend tournament rigs and Friday evening squad stations before public walk-ins.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
                    Food, merch & buddy perks
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    Member discounts at the snack bar, point multipliers, and guest guest-passes for your duo.
                  </p>
                </div>
              </div>
            </div>

            {/* Handwritten footer note */}
            <div className="pt-4 border-t border-dashed border-foreground/20">
              <p className={`${hand.className} text-xl sm:text-2xl text-muted-foreground leading-tight`}>
                Got a plan idea you'd actually buy? Tell our crew at the counter.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA Band */}
      <section className="bg-accent text-accent-foreground mt-8">
        <div className="flex w-full flex-col justify-between gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-end lg:px-16 lg:py-20 xl:px-24">
          <div>
            <p className="mb-2 text-xs font-mono uppercase tracking-widest opacity-80">
              The rigs are hot
            </p>
            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight">
              Ready to jump into a game?
            </h2>
            <p className="mt-4 max-w-xl text-base sm:text-lg opacity-90 leading-relaxed">
              Don't wait on future updates — jump on our high-FPS setups, arcade cabinets, or PS5 booths right now.
            </p>
          </div>
          <Link
            href={BOOK_HREF}
            className="shrink-0 self-start rounded-full bg-accent-foreground px-8 py-4 font-heading text-base font-bold text-accent transition-transform motion-safe:hover:scale-[1.03] motion-safe:active:scale-[.98] lg:self-auto"
          >
            Book your seat now
          </Link>
        </div>
      </section>
    </main>
  );
}
