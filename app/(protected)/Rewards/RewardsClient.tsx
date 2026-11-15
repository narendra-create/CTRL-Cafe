"use client";

/* Section: Imports */
import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Ticket,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Clock,
  ArrowRight,
  Gamepad2,
  Mail,
  Share2,
  Trophy,
  Coins,
  Flame,
  X,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

/* Section: Types */
export type CouponStatus = "expired" | "active" | "used";

export type RedeemHistoryItem = {
  id: string;
  code: string;
  validTill: string | Date;
  balance: number | string;
  couponStatus: CouponStatus;
};

export type RedeemResponse = {
  success: boolean;
  code?: string;
  validtill?: string | Date;
};

export interface RewardsClientProps {
  currentPoints?: number;
  goalPoints?: number;
  redeemHistory?: RedeemHistoryItem[];
  handleRedeem?: () => Promise<RedeemResponse>;
}

/* Section: Mock Data */
const MOCK_CURRENT_POINTS = 130;
const MOCK_GOAL_POINTS = 65;

const MOCK_REDEEM_HISTORY: RedeemHistoryItem[] = [
  {
    id: "rew-1",
    code: "CTRL-PLAY90",
    validTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 90,
    couponStatus: "active",
  },
  {
    id: "rew-2",
    code: "CTRL-SES31",
    validTill: new Date(Date.now() + 115 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 31,
    couponStatus: "active",
  },
  {
    id: "rew-3",
    code: "CTRL-USED00",
    validTill: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 0,
    couponStatus: "used",
  },
  {
    id: "rew-4",
    code: "CTRL-EXP90",
    validTill: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    balance: 90,
    couponStatus: "expired",
  },
];

/* Section: Helpers */
function formatDate(dateValue: string | Date): string {
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(dateValue);
  }
}

function calculateFutureDate(months = 6): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

/* Section: Main Component */
export default function RewardsClient({
  currentPoints = MOCK_CURRENT_POINTS,
  goalPoints = MOCK_GOAL_POINTS,
  redeemHistory = MOCK_REDEEM_HISTORY,
  handleRedeem,
}: RewardsClientProps) {
  /* Section: State */
  const [points, setPoints] = useState<number>(currentPoints);
  const [history, setHistory] = useState<RedeemHistoryItem[]>(redeemHistory);
  const [statusFilter, setStatusFilter] = useState<"all" | CouponStatus>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  /* Section: Popup State */
  const [modalOpen, setModalOpen] = useState(false);
  const [activePopupCode, setActivePopupCode] = useState<{
    code: string;
    validTill: string | Date;
  } | null>(null);

  /* Section: Calculations */
  const isGoalReached = points >= goalPoints;
  const availableRedemptions = Math.floor(points / goalPoints);
  const pointsRemainingForGoal = Math.max(0, goalPoints - points);
  const sessionsNeededForGoal = Math.ceil(pointsRemainingForGoal / 10);
  const progressPercent = Math.min(100, Math.round((points / goalPoints) * 100));

  /* Section: Handlers */
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      setCopiedCode(null);
    }
  };

  const onGetRedeemCode = () => {
    if (!isGoalReached || isPending) return;

    startTransition(async () => {
      let result: RedeemResponse;

      if (handleRedeem) {
        result = await handleRedeem();
      } else {
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const generatedCode = `CTRL-${randomSuffix}`;
        const expiry = calculateFutureDate(6);
        result = {
          success: true,
          code: generatedCode,
          validtill: expiry,
        };
      }

      if (result && result.success && result.code) {
        const codeString = result.code;
        const validTillDate = result.validtill || calculateFutureDate(6);

        setPoints((prev) => Math.max(0, prev - goalPoints));

        const newHistoryItem: RedeemHistoryItem = {
          id: `rew-${Date.now()}`,
          code: codeString,
          validTill: validTillDate,
          balance: 90,
          couponStatus: "active",
        };

        setHistory((prev) => [newHistoryItem, ...prev]);
        setActivePopupCode({
          code: codeString,
          validTill: validTillDate,
        });
        setModalOpen(true);
      }
    });
  };

  /* Section: Filtered Data */
  const filteredHistory = history.filter((item) => {
    if (statusFilter === "all") return true;
    return item.couponStatus === statusFilter;
  });

  /* Section: Render */
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 md:pt-28">
        
        {/* Section: Hero Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border-2 border-foreground dark:border-white/20 bg-linear-to-br from-amber-400 via-amber-300 to-yellow-500 dark:from-amber-600 dark:via-amber-700 dark:to-yellow-800 p-6 sm:p-8 md:p-10 shadow-[6px_6px_0_var(--foreground)] dark:shadow-[6px_6px_0_#000]">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-foreground dark:border-white/30 bg-background/90 px-3.5 py-1 text-xs font-black tracking-widest text-foreground uppercase shadow-[2px_2px_0_var(--foreground)]">
              <Trophy className="size-3.5 text-amber-500 fill-amber-500" />
              <span>CTRL Rewards Lounge</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
              Turn Gaming Sessions Into Free Hours.
            </h1>
            <p className="mt-3 text-base sm:text-lg font-medium text-slate-900/80 dark:text-white/90">
              Every hour you play at CTRL Cafe banks you points. Rack up 65 points to unlock a ₹90 coupon for your next booking.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-foreground/30 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-xs font-bold text-slate-950 dark:text-white">
                <Coins className="size-4 text-amber-700 dark:text-amber-300" />
                <span>10 pts per booked hour</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-foreground/30 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-xs font-bold text-slate-950 dark:text-white">
                <Sparkles className="size-4 text-emerald-700 dark:text-emerald-300" />
                <span>65 pts = ₹90 Discount Code</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-foreground/30 bg-white/70 dark:bg-black/40 px-3 py-1.5 text-xs font-bold text-slate-950 dark:text-white">
                <ShieldCheck className="size-4 text-indigo-700 dark:text-indigo-300" />
                <span>Valid for 6 Months</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-8 -bottom-10 opacity-20 dark:opacity-25 pointer-events-none">
            <Ticket className="size-64 md:size-80 rotate-12 text-slate-950 dark:text-white" />
          </div>
        </div>

        {/* Section: Points Card */}
        <div className="mb-12 rounded-3xl border-2 border-foreground dark:border-white/20 bg-card p-6 sm:p-8 shadow-[6px_6px_0_var(--accent)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                  Your Balance
                </span>
                {isGoalReached ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                    <Flame className="size-3.5 fill-emerald-500 text-emerald-500" />
                    Goal Achieved! ({availableRedemptions} {availableRedemptions === 1 ? "Reward" : "Rewards"} Ready)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/40">
                    <Clock className="size-3.5 text-amber-500" />
                    {sessionsNeededForGoal} {sessionsNeededForGoal === 1 ? "session" : "sessions"} left to goal
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="font-heading text-5xl sm:text-6xl font-black tracking-tight text-foreground">
                  {points}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-muted-foreground">
                  / {goalPoints} pts
                </span>
              </div>

              <div className="mt-4">
                <div className="h-4 w-full overflow-hidden rounded-full border-2 border-foreground dark:border-white/30 bg-muted">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 via-yellow-400 to-emerald-400 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                <div className="mt-2 flex justify-between text-xs font-bold text-muted-foreground">
                  <span>0 pts</span>
                  <span className="font-extrabold text-foreground">Goal: 65 pts (₹90 Coupon)</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-4">
                <p className="text-sm font-semibold text-foreground">
                  {isGoalReached ? (
                    <>
                      🎉 You have crossed the 65 points goal! You can now generate your ₹90 coupon code.
                      {availableRedemptions > 1 && (
                        <span className="block mt-1 text-xs text-muted-foreground">
                          You have {points} points in total — enough to redeem {availableRedemptions} times!
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      You need <strong className="text-foreground">{pointsRemainingForGoal} more points</strong> to redeem.
                      Play <strong className="text-amber-600 dark:text-amber-400">{sessionsNeededForGoal} more {sessionsNeededForGoal === 1 ? "session" : "sessions"}</strong> (at 10 pts/hour) to achieve your ₹90 discount code!
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center gap-3.5 lg:border-l-2 lg:border-dashed lg:border-border lg:pl-8">
              <button
                type="button"
                onClick={onGetRedeemCode}
                disabled={!isGoalReached || isPending}
                className="w-full cursor-pointer rounded-2xl border-2 border-foreground bg-accent px-6 py-4 text-center font-heading text-lg font-black tracking-wide text-accent-foreground shadow-[4px_4px_0_var(--foreground)] transition-all hover:scale-[1.02] active:scale-[0.98] active:shadow-[1px_1px_0_var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="size-5" />
                  <span>
                    {isPending ? "Generating Code..." : "Get Redeem Code (65 pts)"}
                  </span>
                </div>
              </button>

              <Link
                href="/book"
                className="w-full rounded-2xl border-2 border-foreground dark:border-white/20 bg-background hover:bg-muted px-6 py-3.5 text-center font-heading text-base font-bold text-foreground transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Gamepad2 className="size-5 text-amber-500" />
                <span>Book a Session</span>
                <ArrowRight className="size-4 ml-1" />
              </Link>

              <p className="text-center text-xs font-semibold text-muted-foreground">
                Want to earn more points first? Book any station right now on the booking portal.
              </p>
            </div>

          </div>
        </div>

        {/* Section: Process Guide */}
        <div className="mb-14">
          <div className="mb-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Redemption Flow
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              How the Redeem Process Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="relative rounded-2xl border-2 border-foreground dark:border-white/20 bg-card p-6 shadow-[4px_4px_0_var(--foreground)] dark:shadow-[4px_4px_0_#000]">
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-lg">
                1
              </div>
              <h3 className="font-heading text-lg font-black text-foreground mb-2 flex items-center gap-2">
                <span>Click &quot;Get Redeem Code&quot;</span>
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Once you reach the 65 points goal, tap the button to immediately generate your unique ₹90 discount coupon code.
              </p>
            </div>

            <div className="relative rounded-2xl border-2 border-foreground dark:border-white/20 bg-card p-6 shadow-[4px_4px_0_var(--foreground)] dark:shadow-[4px_4px_0_#000]">
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground font-black text-lg">
                2
              </div>
              <h3 className="font-heading text-lg font-black text-foreground mb-2 flex items-center gap-2">
                <span>Copy &amp; Email Delivery</span>
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Copy the code directly from the screen. A permanent backup copy is also automatically delivered to your registered email inbox.
              </p>
            </div>

            <div className="relative rounded-2xl border-2 border-foreground dark:border-white/20 bg-card p-6 shadow-[4px_4px_0_var(--foreground)] dark:shadow-[4px_4px_0_#000]">
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black text-lg">
                3
              </div>
              <h3 className="font-heading text-lg font-black text-foreground mb-2 flex items-center gap-2">
                <span>Apply on /book Checkout</span>
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                During station booking, paste the code in the &quot;Enter Redeem Code&quot; section to instantly deduct the discount from your device amount.
              </p>
            </div>
          </div>

          {/* Section: Rules & Perks */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="rounded-2xl border border-border bg-card p-4.5 flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Gamepad2 className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Devices &amp; Stations Only</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Discount applies to PC, Console, and Arcade seat rates only. Excludes cafe food and snacks.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4.5 flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Wallet className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Max ₹90 Discount</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Every coupon code provides up to ₹90 maximum discount per redemption.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4.5 flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <RotateCcw className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Leftover Balance Stays</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Redeemed on a ₹59 session? Your remaining ₹31 balance remains on the code for your next booking!
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4.5 flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Calendar className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Valid for 6 Months</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Your coupon code remains active and ready to use for 6 whole months from generation.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4.5 flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Share2 className="size-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Share with Friends</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Codes are transferrable! You can share your code with squad mates or friends to use.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4.5 flex items-start gap-3.5">
              <div className="size-10 rounded-xl bg-slate-500/15 border border-slate-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">Permanent Record</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Generated codes cannot be erased, and depleted codes cannot be reused once fully spent.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Section: Redeem History */}
        <div className="rounded-3xl border-2 border-foreground dark:border-white/20 bg-card p-6 sm:p-8 shadow-[6px_6px_0_var(--foreground)] dark:shadow-[6px_6px_0_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Coupons &amp; Ledger
              </span>
              <h3 className="font-heading text-2xl font-black text-foreground">
                Redeem History
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-border bg-muted/60">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`cursor-pointer px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === "all"
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({history.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`cursor-pointer px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === "active"
                    ? "bg-emerald-500 text-slate-950 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("used")}
                className={`cursor-pointer px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === "used"
                    ? "bg-blue-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Used
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("expired")}
                className={`cursor-pointer px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === "expired"
                    ? "bg-rose-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expired
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center">
              <Ticket className="size-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-bold text-foreground">No redeem records found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {statusFilter === "all"
                  ? "You haven't generated any discount codes yet. Stack points to get your first code!"
                  : `No coupons matching status "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHistory.map((item) => {
                const isCopied = copiedCode === item.code;
                const isCurrentActive = item.couponStatus === "active";

                let statusBadgeClass = "bg-muted text-muted-foreground border-muted-foreground/30";
                const statusLabel = item.couponStatus.toUpperCase();

                if (item.couponStatus === "active") {
                  statusBadgeClass = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50";
                } else if (item.couponStatus === "used") {
                  statusBadgeClass = "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50";
                } else if (item.couponStatus === "expired") {
                  statusBadgeClass = "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50";
                }

                return (
                  <div
                    key={item.id}
                    className="relative rounded-2xl border-2 border-border bg-background p-4 sm:p-5 transition-all hover:border-foreground dark:hover:border-white/40"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-black border uppercase ${statusBadgeClass}`}>
                        {item.couponStatus === "active" && (
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        {statusLabel}
                      </span>

                      <span className="font-heading font-extrabold text-sm text-foreground">
                        ₹{item.balance} Left
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-3.5 py-2.5">
                      <code className="font-mono text-base sm:text-lg font-black tracking-wider text-foreground">
                        {item.code}
                      </code>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.code)}
                        className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground transition-all hover:bg-muted active:scale-95 flex items-center gap-1.5"
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground font-medium pt-2 border-t border-border/60">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        <span>Valid till: {formatDate(item.validTill)}</span>
                      </div>

                      {isCurrentActive && (
                        <Link
                          href="/book"
                          className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>Use on /book</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Section: Popup Modal */}
      {modalOpen && activePopupCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-foreground dark:border-white/20 bg-background p-6 sm:p-8 shadow-[8px_8px_0_var(--accent)] animate-in fade-in zoom-in-95 duration-200">
            
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div className="text-center">
              <div className="mx-auto mb-3 inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[3px_3px_0_var(--foreground)]">
                <Sparkles className="size-7" />
              </div>
              <h3 className="font-heading text-2xl font-black text-foreground">
                Coupon Code Unlocked!
              </h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Your ₹90 discount code is ready to use for device bookings.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-accent bg-accent/10 p-5 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1">
                Your Redeem Code
              </span>
              <p className="font-mono text-2xl sm:text-3xl font-black tracking-widest text-foreground select-all">
                {activePopupCode.code}
              </p>

              <button
                type="button"
                onClick={() => copyToClipboard(activePopupCode.code)}
                className="mt-4 w-full cursor-pointer rounded-xl border-2 border-foreground bg-accent py-2.5 px-4 font-heading text-sm font-black text-accent-foreground shadow-[2px_2px_0_var(--foreground)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-2"
              >
                {copiedCode === activePopupCode.code ? (
                  <>
                    <Check className="size-4 text-emerald-700 dark:text-emerald-950" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 space-y-2 rounded-xl border border-border bg-muted/40 p-3.5 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Value: <strong>₹90.00</strong> (Applies to device hourly fees)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-amber-500 shrink-0" />
                <span>Valid till: <strong>{formatDate(activePopupCode.validTill)}</strong> (6 months)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-indigo-500 shrink-0" />
                <span>We also sent a copy of this code to your email.</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/book"
                onClick={() => setModalOpen(false)}
                className="w-full rounded-xl border-2 border-foreground bg-foreground text-background py-3 text-center font-heading text-sm font-black transition-all hover:opacity-90 flex items-center justify-center gap-2"
              >
                <Gamepad2 className="size-4 text-amber-400" />
                <span>Book a Session Now (/book)</span>
              </Link>
              
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full cursor-pointer rounded-xl border border-border bg-background hover:bg-muted py-2.5 text-center text-xs font-bold text-foreground transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
