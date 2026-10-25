import { getDevices } from "@/lib/controllers/deviceController";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Prices | CTRL-CAFE",
  description: "Hourly and full-day prices for every device at CTRL-CAFE.",
};

const BOOK_HREF = "/book";
const PLANS_HREF = "/Plans";

type DevicePrice = {
  device: string;
  prices: {
    hourly: number;
    daily?: number | null;
  };
};

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Shared row spacing so the device rows and the passes row line up.
const row = "grid gap-x-8 gap-y-3 py-7 md:py-10 xl:py-12";

const Prices = async () => {
  const result = await getDevices();

  if (!result) {
    return;
  }

  const DEVICES: DevicePrice[] =
    result.data?.map((device) => ({
      device: device.deviceName,
      prices: {
        hourly: Number(device.hourlyRate),
      },
    })) ?? [];

  return (
    <main className="w-full mt-5 md:mt-15">
      <div className="w-full px-5 pt-12 pb-16 sm:px-8 lg:px-22 lg:pt-20 lg:pb-24 xl:px-26">
        {/* Header */}
        <header className="mb-14 grid items-end gap-8 lg:mb-24 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <div>
            <p className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-accent"
              />
              Prices
            </p>
            <h1 className="font-heading text-4xl leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
              Pay by the hour, or take{" "}
              <span className="relative inline-block whitespace-nowrap">
                the whole day
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
          </div>
          <p className="max-w-[44ch] text-lg text-muted-foreground lg:pb-3 lg:text-xl">
            Find your device and see what it costs. Book by the hour, or for the
            full day where it's available.
          </p>
        </header>

        {/* Prices: no card, just rows */}
        <section aria-labelledby="by-device">
          <h2 id="by-device" className="sr-only">
            Prices by device
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {DEVICES.map(({ device, prices }, i) => (
              <li
                key={device}
                className={`group grid-cols-2 items-baseline md:grid-cols-[minmax(0,1.6fr)_1fr_1fr] ${row}`}
              >
                <div className="col-span-2 flex items-baseline gap-4 md:col-span-1">
                  <span
                    aria-hidden="true"
                    className="text-sm md:text-xl text-muted-foreground tabular-nums transition-colors group-hover:text-foreground"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-4xl font-extrabold tracking-tight transition-transform motion-safe:group-hover:translate-x-2 lg:text-6xl xl:text-7xl">
                    {device}
                  </h3>
                </div>

                <p className="text-3xl font-bold tabular-nums lg:text-5xl xl:text-6xl">
                  <span className="sr-only">Per hour: </span>
                  <span className="underline decoration-accent decoration-4 underline-offset-8">
                    {rupee(prices.hourly)}
                  </span>
                  <span className="ml-1.5 text-base font-medium text-muted-foreground">
                    /hr
                  </span>
                </p>

                <p className="text-3xl font-bold tabular-nums lg:text-5xl xl:text-6xl">
                  <span className="sr-only">Full day: </span>
                  {prices.daily == null ? (
                    <span className="text-lg font-medium text-muted-foreground">
                      Hourly only
                    </span>
                  ) : (
                    <>
                      {rupee(prices.daily)}
                      <span className="ml-1.5 text-base font-medium text-muted-foreground">
                        /day
                      </span>
                    </>
                  )}
                </p>
              </li>
            ))}

          </ul>
        </section>

        {/* Passes notice */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center lg:mt-16 lg:pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 dark:bg-amber-500/15 px-3 py-0.5 text-xs font-mono font-semibold text-yellow-800 dark:text-yellow-400 uppercase tracking-wider">
                Passes Available
              </span>
            </div>
            <h3 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Play regularly? Save more with a pass.
            </h3>
            <p className="max-w-[52ch] text-base text-muted-foreground lg:text-lg">
              Daily and monthly gaming passes are also available so you don't have to pay hour by hour.
            </p>
          </div>
          <Link
            href={PLANS_HREF}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-foreground bg-accent px-7 py-3.5 font-heading text-base font-bold text-accent-foreground shadow-[3px_3px_0_var(--foreground)] transition-transform motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
          >
            <span>Buy a pass</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Ready to play: edge-to-edge band */}
      <section className="bg-accent text-accent-foreground">
        <div className="flex w-full flex-col justify-between gap-10 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:px-12 lg:py-24 xl:px-16">
          <div>
            <p className="mb-3 text-sm font-medium opacity-80">
              Go on, press start.
            </p>
            <h2 className="font-heading text-6xl leading-none font-extrabold tracking-tight lg:text-8xl">
              Ready to play?
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg opacity-90 lg:text-xl">
              Pick a seat and a time. Every hour you book also adds 10 points
              toward a free one.
            </p>
          </div>
          <Link
            href={BOOK_HREF}
            className="shrink-0 self-start rounded-full bg-accent-foreground px-9 py-4 text-lg font-semibold text-accent transition-transform motion-safe:hover:scale-[1.03] motion-safe:active:scale-[.98] lg:self-auto"
          >
            Book a seat
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Prices;
