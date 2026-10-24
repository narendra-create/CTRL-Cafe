"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import { MotionConfig, motion, useInView } from "motion/react";

// Fonts are loaded here so the section keeps its own look, whatever font the rest of the site uses.
const display = Bricolage_Grotesque({ subsets: ["latin"] });
const hand = Caveat({ subsets: ["latin"], weight: "600" });

const PTS_PER_HOUR = 10;
const GOAL = 65; // points for one free hour
const SLOTS = 7; // hours shown on the card
const TILT = [-4, 3, -2, 5, -3, 2, -5];
const DEMO_START_HOURS = 5;

const STEPS = [
  { title: "Play an hour, get 10 points", body: "Every hour you book adds 10 points to your account." },
  { title: "Reach 65", body: "That's about 7 hours of play. Your balance shows how close you are." },
  { title: "Redeem a free hour", body: "Spend 65 points on one hour, no strings attached." },
];

const MotionLink = motion.create(Link);

// Light mode = the paper-* tokens. Dark mode = dark: variants that use your own theme tokens.
const btn =
  "inline-block cursor-pointer rounded-xl border-2 font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
const btnOnPage = `${btn} border-foreground bg-accent px-5 py-3 text-accent-foreground shadow-[3px_3px_0_var(--foreground)]`;
const btnCard = `${btn} border-paper-foreground px-4 py-2.5 text-sm shadow-[3px_3px_0_var(--paper-foreground)] dark:border-papper-foreground dark:shadow-[3px_3px_0_var(--accent-foreground)]`;
const btnCardSolid = `${btnCard} bg-accent text-accent-foreground`;
const btnCardGhost = `${btnCard} bg-transparent text-paper-foreground dark:text-accent-foreground`;
const lineColor = "border-paper-line dark:border-muted-foreground/40";
const mutedText = "text-paper-muted dark:text-muted-foreground";
const press = { whileHover: { x: -1, y: -1 }, whileTap: { x: 3, y: 3 } };

type RewardsSectionProps = {
  /** Logged-in user's points. Pass null/undefined for visitors (they get the demo card). */
  points?: number | null;
  /** Called on "Claim reward" for logged-in users. Pass a server action; validate and deduct points on the server. */
  onClaim?: () => void | Promise<void>;
  loginHref?: string;
  bookHref?: string;
  howItWorksHref?: string;
};

export default function RewardsSection({
  points,
  onClaim,
  loginHref = "/auth/login",
  bookHref = "/book",
  howItWorksHref = "/rewards",
}: RewardsSectionProps) {
  const isMember = typeof points === "number";
  const [demoHours, setDemoHours] = useState(DEMO_START_HOURS);
  const [needLogin, setNeedLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [settled, setSettled] = useState(false);

  const pts = typeof points === "number" ? Math.max(0, points) : demoHours * PTS_PER_HOUR;
  const hours = Math.min(Math.floor(pts / PTS_PER_HOUR), SLOTS);
  const unlocked = pts >= GOAL;
  const rewards = Math.floor(pts / GOAL);
  const left = GOAL - pts;
  const hoursLeft = Math.ceil(left / PTS_PER_HOUR);
  const pct = (Math.min(pts, GOAL) / GOAL) * 100;

  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -80px 0px" });

  // After the first reveal, new stamps should pop instantly instead of waiting in the stagger.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setSettled(true), 1100);
    return () => clearTimeout(t);
  }, [inView]);

  async function claim() {
    if (!isMember) {
      setNeedLogin(true);
      return;
    }
    if (!onClaim || busy) return;
    setBusy(true);
    try {
      await onClaim();
    } finally {
      setBusy(false);
    }
  }

  const note = !isMember ? "try it, add an hour" : unlocked ? "ready to cash in" : "your card";
  const toGo = `${left} pts to go. ${hoursLeft === 1 ? "One more hour." : `${hoursLeft} more hours.`}`;
  const message = !isMember
    ? needLogin
      ? "You need to log in to earn rewards. This card is only a demo."
      : unlocked
        ? "Free hour unlocked. Go on, claim it."
        : toGo
    : unlocked
      ? rewards > 1
        ? `${rewards} free hours ready to claim.`
        : "Free hour unlocked. That one's on the house."
      : toGo;

  const stampDelay = (i: number) => (settled ? 0 : i * 0.07);
  const secondaryBtn = unlocked ? btnCardGhost : btnCardSolid;

  return (
    <MotionConfig reducedMotion="user">
      <section id="rewards" className={`${display.className} text-foreground`}>
        <div className="mx-auto grid max-w-[1040px] grid-cols-1 items-center gap-10 px-5 py-12 md:grid-cols-[1.05fr_1fr] md:gap-14 md:px-6 md:py-[72px]">
          {/* Left: the pitch */}
          <div>
            <p className="mb-4 inline-block rounded-full border-[1.5px] border-dashed border-muted-foreground px-3 py-1 text-[.8rem] font-semibold tracking-[.08em] text-muted-foreground uppercase">
              CTRL Points
            </p>
            <h2 className="mb-4 text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.04] font-extrabold tracking-tight">
              Every 7 hours,
              <br />
              one's{" "}
              <mark className="inline-block -rotate-[1.5deg] rounded-lg bg-accent px-[.2em] text-accent-foreground">
                on us
              </mark>
              .
            </h2>
            <p className="mb-7 max-w-[46ch] text-lg text-muted-foreground">
              Book a seat and the points add up on their own. Stack enough, and we'll cover a whole hour of play.
            </p>

            <ol className="mb-8 grid gap-[18px]">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[40px_1fr] items-start gap-3.5">
                  <span
                    className={`grid size-10 place-items-center rounded-full border-2 font-extrabold ${
                      i === 1 ? "border-accent bg-accent text-accent-foreground" : "border-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <b className="block">{s.title}</b>
                    <span className="text-[.95rem] text-muted-foreground">{s.body}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap items-center gap-3.5">
              <MotionLink href={bookHref} className={btnOnPage} {...press}>
                Book a seat
              </MotionLink>
              <Link href={howItWorksHref} className="font-semibold underline underline-offset-4">
                See how points work
              </Link>
            </div>
          </div>

          {/* Right: the points card */}
          <div>
            <p className={`${hand.className} mb-1 ml-4 flex items-end gap-1.5 text-[1.45rem] text-muted-foreground`}>
              <span>{note}</span>
              <svg
                viewBox="0 0 46 44"
                aria-hidden="true"
                className="h-11 w-[46px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
              >
                <path d="M4 6C24 2 40 14 38 36" />
                <path d="M30 29l8 8 6-9" />
              </svg>
            </p>

            <div
              ref={cardRef}
              className="-rotate-[.8deg] rounded-[20px] border-2 border-paper-foreground bg-paper p-[22px] pb-5 text-paper-foreground dark:accent-foreground shadow-[8px_8px_0_var(--accent)] md:-rotate-[1.4deg] dark:border-foreground dark:bg-card"
            >
              <div className={`mb-4 flex items-baseline justify-between border-b-2 border-dashed pb-3 ${lineColor}`}>
                <b className="font-extrabold tracking-wide">CTRL-CAFE</b>
                <span className={`text-[.8rem] font-semibold tracking-[.06em] uppercase ${mutedText}`}>
                  {isMember ? "Points card" : "Demo card"}
                </span>
              </div>

              <div className="mb-5 grid grid-cols-4 gap-3" aria-hidden="true">
                {Array.from({ length: SLOTS }, (_, i) =>
                  i < hours ? (
                    <motion.div
                      key={`on-${i}`}
                      className="grid aspect-square place-items-center rounded-full border-2 border-paper-foreground bg-accent font-extrabold text-accent-foreground dark:accent-foreground"
                      initial={{ scale: 1.35, opacity: 0, rotate: TILT[i] }}
                      animate={inView ? { scale: 1, opacity: 1, rotate: TILT[i] } : undefined}
                      transition={{ type: "spring", stiffness: 520, damping: 18, delay: stampDelay(i) }}
                    >
                      +10
                    </motion.div>
                  ) : (
                    <div
                      key={`off-${i}`}
                      className={`grid aspect-square place-items-center rounded-full border-2 border-dashed text-[.95rem] font-semibold ${lineColor} ${mutedText}`}
                    >
                      {i + 1}h
                    </div>
                  ),
                )}

                {unlocked ? (
                  <motion.div
                    key="free-on"
                    className="grid rotate-3 place-items-center rounded-[14px] border-2 border-paper-foreground bg-paper-foreground text-center text-[.72rem] leading-tight font-extrabold tracking-[.05em] text-accent dark:border-foreground dark:bg-foreground dark:text-background"
                    initial={{ scale: 1.35, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : undefined}
                    transition={{ type: "spring", stiffness: 520, damping: 18, delay: settled ? 0.15 : SLOTS * 0.07 }}
                  >
                    FREE
                    <br />
                    HOUR
                  </motion.div>
                ) : (
                  <div className="grid rotate-3 place-items-center rounded-[14px] border-2 border-dashed border-paper-foreground text-center text-[.72rem] leading-tight font-extrabold tracking-[.05em] dark:border-foreground">
                    FREE
                    <br />
                    HOUR
                  </div>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <strong className="text-[2.6rem] leading-none font-extrabold tracking-tight">{pts}</strong>
                <span className={`font-semibold ${mutedText}`}>/ {GOAL} pts</span>
              </div>

              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={GOAL}
                aria-valuenow={Math.min(pts, GOAL)}
                className="my-2.5 h-3.5 overflow-hidden rounded-full border-2 border-paper-foreground bg-paper-track dark:border-accent-foreground dark:bg-secondary"
              >
                <motion.div
                  className={`h-full bg-accent ${pct > 0 ? "border-r-2 border-paper-foreground dark:border-accent-foreground/40" : ""}`}
                  initial={{ width: 0 }}
                  animate={{ width: inView ? `${pct}%` : 0 }}
                  transition={{ duration: settled ? 0.4 : 0.7, ease: "easeOut", delay: settled ? 0 : 0.3 }}
                />
              </div>

              <p aria-live="polite" className="mb-4 min-h-6 font-semibold">
                {message}
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                {unlocked &&
                  (!isMember && needLogin ? (
                    <MotionLink href={loginHref} className={btnCardSolid} {...press}>
                      Log in
                    </MotionLink>
                  ) : (
                    <motion.button type="button" onClick={claim} disabled={busy} className={btnCardSolid} {...press}>
                      {busy ? "Claiming…" : "Claim reward"}
                    </motion.button>
                  ))}

                {isMember ? (
                  <MotionLink href={bookHref} className={secondaryBtn} {...press}>
                    + 1 hour
                  </MotionLink>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setDemoHours((h) => Math.min(h + 1, SLOTS))}
                    disabled={demoHours >= SLOTS}
                    className={secondaryBtn}
                    {...press}
                  >
                    + 1 hour
                  </motion.button>
                )}
              </div>

              {!isMember && (
                <p className={`mt-4 text-xs font-semibold ${mutedText}`}>
                  This is a demo only.{" "}
                  <Link
                    href={loginHref}
                    className="text-paper-foreground underline underline-offset-2 dark:text-accent-foreground"
                  >
                    Log in
                  </Link>{" "}
                  to collect real points.
                </p>
              )}

              <p className={`mt-4 border-t-2 border-dashed pt-3 text-xs font-semibold ${lineColor} ${mutedText}`}>
                10 pts per booked hour · 65 pts = 1 free hour
              </p>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}