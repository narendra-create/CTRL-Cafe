"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import { MotionConfig, motion } from "motion/react";

const display = Bricolage_Grotesque({ subsets: ["latin"] });
const hand = Caveat({ subsets: ["latin"], weight: "600" });

const PLANS = [
  { id: "monthly", label: "Monthly", line: "A set number of hours every day, for a month." },
  { id: "yearly", label: "Yearly", line: "A set number of hours every day, for a whole year." },
] as const;
type PlanId = (typeof PLANS)[number]["id"];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

type MembershipSectionProps = {
  plansHref?: string;
};

export default function MembershipSection({ plansHref = "/Plans" }: MembershipSectionProps) {
  const [plan, setPlan] = useState<PlanId>("monthly");
  const uid = useId();
  const current = PLANS.find((p) => p.id === plan) ?? PLANS[0];

  return (
    <MotionConfig reducedMotion="user">
      <section className={`${display.className} text-foreground`}>
        {/* A dashed "cut here" coupon, kept quiet on purpose so the rewards card stays the hero */}
        <div className="relative rotate-[.8deg] rounded-2xl border-2 border-dashed border-foreground/70 p-5 pt-6">
          <motion.span
            className={`${hand.className} absolute -top-4 right-5 rounded-md border-2 border-foreground bg-accent px-2.5 py-0.5 text-[1.3rem] leading-tight text-accent-foreground`}
            initial={{ scale: 1.6, opacity: 0, rotate: 16 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 7 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            Coming soon
          </motion.span>

          <b className="font-extrabold tracking-wide">Daily pass</b>
          <h3 className="mt-1 mb-4 text-2xl leading-tight font-extrabold tracking-tight">Play every day, pay once.</h3>

          <div
            role="radiogroup"
            aria-label="Plan length"
            className="mb-3 inline-flex rounded-full border-2 border-foreground p-1"
          >
            {PLANS.map((p) => {
              const on = p.id === plan;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPlan(p.id)}
                  className="relative cursor-pointer rounded-full px-4 py-1 text-sm font-bold"
                >
                  {on && (
                    <motion.span
                      layoutId={`plan-pill-${uid}`}
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 500, damping: 34 }}
                    />
                  )}
                  <span className={`relative ${on ? "text-accent-foreground" : "text-muted-foreground"}`}>
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>

          <motion.p
            key={plan}
            aria-live="polite"
            className="mb-4 min-h-[3em] text-[.95rem] text-muted-foreground"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {current.line}
          </motion.p>

          <div className="mb-1 flex gap-1.5" aria-hidden="true">
            {DAYS.map((d, i) => (
              <span
                key={i}
                className="grid size-8 place-items-center rounded-md border-2 border-foreground bg-accent text-xs font-extrabold text-accent-foreground"
              >
                {d}
              </span>
            ))}
          </div>
          <p className={`${hand.className} mb-4 text-[1.25rem] leading-tight text-muted-foreground`}>
            no more counting hours
          </p>

          <div className="border-t-2 border-dashed border-foreground/40 pt-3">
            <Link href={plansHref} className="text-sm font-semibold underline underline-offset-4">
              See plans and benefits
            </Link>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
