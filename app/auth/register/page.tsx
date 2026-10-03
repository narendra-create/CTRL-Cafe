"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendOtp, verifyOtp } from "@/lib/actions/otp";

/* OTP step states */
type OtpStep = "idle" | "sent" | "verified";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* OTP State Section */
  const [otpStep, setOtpStep] = useState<OtpStep>("idle");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailRef = useRef<HTMLInputElement>(null);

  /* OTP Send Handler (logic left for user) */
  const handleSendOtp = async () => {
    const email = emailRef.current?.value.trim();
    if (!email) {
      setOtpError("Enter your email first.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    const data = await sendOtp(email);
    if (!data.success) {
      setError(data.error!);
      setOtpLoading(false);
      setResendCooldown(60);
      return;
    }

    setOtpLoading(false);
    setOtpStep("sent");
    /* Resend cooldown — 60s */
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };

  /* OTP digit input handler */
  const handleOtpDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    setOtpError(null);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...otpDigits];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtpDigits(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* OTP Verify Handler (logic left for user) */
  const handleVerifyOtp = async () => {
    const email = emailRef.current?.value.trim();
    if (!email) {
      setOtpError("Enter your email first.");
      return;
    }
    const code = otpDigits.join("");
    if (code.length < 6) {
      setOtpError("Enter all 6 digits.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    const data = await verifyOtp(code, email);
    if (!data.success) {
      setOtpError(data.error ?? "Incorrect Code. Try again.");
      setOtpLoading(false);
      return;
    }

    setOtpLoading(false);
    setOtpStep("verified");
  };

  /* Register Submit Handler */
  const handleSubmit = async (formdata: FormData) => {
    if (otpStep !== "verified") return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: formdata.get("email") as string,
      password: formdata.get("password") as string,
      options: { data: { name: formdata.get("name") as string } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    window.location.href = "/";
  };

  /* OAuth Handlers */
  const handleGoogleSignup = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleDiscordSignUp = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const otpFilled = otpDigits.join("").length === 6;

  return (
    <div className="min-h-[100dvh] bg-[#15191a] md:bg-[#d8d1c5] dark:md:bg-[#0a0a0a] md:p-[clamp(14px,3vw,38px)] block md:grid md:place-items-center font-sans transition-colors duration-300">
      <main className="w-full max-w-[1180px] min-h-screen md:min-h-[min(760px,calc(100vh-28px))] block md:grid md:grid-cols-[1.04fr_0.96fr] bg-[#15191a] md:rounded-[28px] overflow-hidden md:shadow-[0_30px_90px_rgba(0,0,0,0.34)] relative">
        {/* Showcase Section */}
        <section className="flex flex-col justify-between relative overflow-hidden px-[23px] pt-[25px] pb-[28px] min-h-[265px] md:p-[clamp(26px,4vw,58px)] md:min-h-[700px] bg-[radial-gradient(circle_at_83%_12%,rgba(250,204,21,0.22),transparent_30%),linear-gradient(145deg,#242c2c,#121718_70%)] text-[#f7f3ed]">
          {/* Background Rings */}
          <div className="absolute border border-[rgba(250,204,21,0.16)] rounded-full pointer-events-none w-[330px] h-[330px] -right-[175px] -bottom-[190px] md:w-[540px] md:h-[540px] md:-right-[260px] md:-bottom-[210px]"></div>
          <div className="absolute border border-[rgba(250,204,21,0.16)] rounded-full pointer-events-none w-[230px] h-[230px] -right-[115px] -bottom-[135px] md:w-[370px] md:h-[370px] md:-right-[170px] md:-bottom-[125px]"></div>

          <div className="flex items-center gap-[11px] font-[800] tracking-[-0.03em] text-[18px] relative z-10">
            <div className="w-[32px] h-[32px] bg-[#FACC15] rounded-[10px_10px_10px_3px] grid place-items-center text-[#15201b] -rotate-8 overflow-hidden relative">
              <Image
                src="/CTRL-CAFE-ICON.webp"
                alt="Icon"
                fill
                className="object-cover"
              />
            </div>
            <span>CTRL-CAFE</span>
          </div>

          <div className="relative z-10 max-w-[490px] mt-[34px] md:mt-0">
            <p className="text-[#FACC15] text-[11px] tracking-[0.16em] uppercase font-[800] m-0 mb-[18px]">
              Your seat is waiting
            </p>
            <h1 className="text-[38px] min-[370px]:text-[42px] md:text-[clamp(42px,5.2vw,76px)] leading-[0.93] tracking-[-0.075em] m-0 mb-[12px] md:mb-[23px] font-[680]">
              Play more.
              <br />
              <em className="not-italic text-[#ff876d]">Stay awhile.</em>
            </h1>
            <p className="text-[#c5c4bb] leading-[1.65] text-[13px] md:text-[15px] max-w-[310px] md:max-w-[395px] m-0">
              A cozy gaming lounge for big wins, friendly rivalry, and that one
              more round feeling.
            </p>
          </div>

          <div className="hidden md:flex gap-[30px] relative z-10">
            <div>
              <strong className="block text-[21px] tracking-[-0.04em]">
                24/7
              </strong>
              <span className="text-[11px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">
                good vibes
              </span>
            </div>
            <div>
              <strong className="block text-[21px] tracking-[-0.04em]">
                ∞
              </strong>
              <span className="text-[11px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">
                rematches
              </span>
            </div>
          </div>
        </section>

        {/* Auth Content Section */}
        <section className="bg-[#f4efe7] dark:bg-[#15191a] text-[#19201f] dark:text-[#f7f3ed] p-[31px_23px_42px] md:p-[clamp(27px,5vw,70px)] flex items-start md:items-center min-h-[calc(100dvh-265px)] md:min-h-0 transition-colors duration-300">
          <div className="w-full max-w-[390px] mx-auto">
            {/* Header Row */}
            <div className="flex flex-col min-[370px]:flex-row justify-between items-start mb-[24px] md:mb-[30px]">
              <div>
                <h2 className="text-[29px] md:text-[32px] tracking-[-0.06em] m-0 mb-[8px] font-[800]">
                  Create account
                </h2>
                <p className="m-0 text-[#77766f] dark:text-[#b8b4ac] text-[14px]">
                  Your next great session starts here.
                </p>
              </div>
              <div className="text-[13px] text-[#6d6d65] dark:text-[#b8b4ac] text-left min-[370px]:text-right mt-[14px] min-[370px]:mt-0">
                <span>Already a member?</span>
                <Link
                  href="/auth/login"
                  className="block border-0 bg-transparent text-[#1b2524] dark:text-[#FACC15] font-[800] py-[5px] underline underline-offset-[4px]"
                >
                  Log in
                </Link>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-[8px] mb-[22px]">
              {[
                { n: 1, label: "Fill details", done: otpStep !== "idle" },
                { n: 2, label: "Verify email", done: otpStep === "verified" },
                { n: 3, label: "Create account", done: false },
              ].map((step, i) => {
                const active =
                  (i === 0 && otpStep === "idle") ||
                  (i === 1 && (otpStep === "sent" || otpStep === "verified")) ||
                  (i === 2 && otpStep === "verified");
                return (
                  <React.Fragment key={step.n}>
                    <div className="flex items-center gap-[5px]">
                      <div
                        className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-[800] transition-all duration-200 shrink-0 ${
                          step.done
                            ? "bg-[#FACC15] text-black"
                            : active
                              ? "bg-[#202b29] dark:bg-[#FACC15] text-white dark:text-black"
                              : "bg-[#ddd8ce] dark:bg-white/10 text-[#9a9890] dark:text-[#70746d]"
                        }`}
                      >
                        {step.done ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          step.n
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-[700] hidden min-[420px]:block transition-colors ${
                          active || step.done
                            ? "text-[#3d4a47] dark:text-[#c5c4bb]"
                            : "text-[#a09d94] dark:text-[#70746d]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        className={`h-px flex-1 transition-colors duration-300 ${step.done ? "bg-[#FACC15]/50" : "bg-[#ddd8ce] dark:bg-white/10"}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <form className="grid gap-[15px]" action={handleSubmit}>
              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-[10px] bg-[#ff4d4d]/10 dark:bg-[#ff4d4d]/15 border border-[#ff4d4d]/25 rounded-[12px] p-[12px_15px]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="shrink-0"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="#ff4d4d"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 4.5v4"
                      stroke="#ff4d4d"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="11" r="0.75" fill="#ff4d4d" />
                  </svg>
                  <p className="m-0 text-[12px] text-[#cc3333] dark:text-[#ff6b6b] font-[600] flex-1">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="border-0 bg-transparent text-[#cc3333] dark:text-[#ff6b6b] text-[18px] leading-none cursor-pointer p-0 hover:opacity-60 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Name Field */}
              <div className="grid gap-[8px]">
                <label
                  htmlFor="name"
                  className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb]"
                >
                  Your name
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                  disabled={loading || otpStep !== "idle"}
                  className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] p-[14px_15px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a09d94] dark:placeholder:text-[#70746d] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Email Field + Send OTP */}
              <div className="grid gap-[8px]">
                <label
                  htmlFor="email"
                  className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb]"
                >
                  Email address
                </label>
                <div className="flex gap-[8px]">
                  <input
                    ref={emailRef}
                    name="email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    disabled={loading || otpStep !== "idle"}
                    className="flex-1 min-w-0 border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] p-[14px_15px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a09d94] dark:placeholder:text-[#70746d] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {/* Send / Verified badge */}
                  {otpStep === "verified" ? (
                    <div className="shrink-0 flex items-center gap-[5px] px-[12px] rounded-[12px] bg-[#FACC15]/15 border border-[#FACC15]/30 text-[#7a6000] dark:text-[#FACC15] text-[12px] font-[800]">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Verified
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading || otpStep === "sent"}
                      className="shrink-0 border-0 rounded-[12px] px-[13px] py-[11px] bg-[#202b29] dark:bg-white/[0.08] text-white dark:text-[#c5c4bb] text-[12px] font-[800] cursor-pointer hover:bg-[#2e3e3a] dark:hover:bg-white/[0.12] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[6px] whitespace-nowrap"
                    >
                      {otpLoading ? (
                        <svg
                          className="animate-spin h-[13px] w-[13px]"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-25"
                          />
                          <path
                            d="M12 2a10 10 0 019.17 6"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="opacity-75"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22 2L11 13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 2L15 22l-4-9-9-4 20-7z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {otpStep === "sent" ? "Sent" : "Send OTP"}
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Entry Section */}
              {(otpStep === "sent" || otpStep === "verified") && (
                <div className="grid gap-[10px] bg-[#f0ebe2] dark:bg-white/[0.03] border border-[#ddd8ce] dark:border-white/8 rounded-[14px] p-[16px_15px]">
                  {/* OTP Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb] m-0">
                      {otpStep === "verified"
                        ? "Email verified ✓"
                        : "Enter 6-digit code"}
                    </p>
                    {otpStep === "sent" && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={resendCooldown > 0 || otpLoading}
                        className="text-[11px] font-[700] text-[#77766f] dark:text-[#b8b4ac] border-0 bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#FACC15] dark:hover:text-[#FACC15] transition-colors"
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend code"}
                      </button>
                    )}
                  </div>

                  {otpStep === "verified" ? (
                    /* Verified Banner */
                    <div className="flex items-center gap-[8px] bg-[#FACC15]/12 rounded-[10px] p-[10px_12px]">
                      <div className="w-[22px] h-[22px] rounded-full bg-[#FACC15]/20 border border-[#FACC15]/40 grid place-items-center shrink-0">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="#FACC15"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="text-[12px] text-[#7a6000] dark:text-[#FACC15] font-[700] m-0">
                        Email address confirmed — you&apos;re good to go.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* 6-box OTP input */}
                      <div
                        className="grid grid-cols-6 gap-[6px]"
                        onPaste={handleOtpPaste}
                      >
                        {otpDigits.map((digit, i) => (
                          <input
                            key={i}
                            ref={(el) => {
                              otpRefs.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigit(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            disabled={otpLoading}
                            className={`w-full h-[46px] text-center text-[18px] font-[800] border rounded-[10px] bg-[#fffdf9] dark:bg-white/5 text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-150 font-sans disabled:opacity-50 disabled:cursor-not-allowed caret-[#FACC15] ${
                              otpError
                                ? "border-[#ff4d4d]/50 focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.10)]"
                                : digit
                                  ? "border-[#FACC15]/60 focus:border-[#FACC15] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.13)]"
                                  : "border-[#d7d2c8] dark:border-white/10 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_3px_rgba(250,204,21,0.13)]"
                            }`}
                          />
                        ))}
                      </div>

                      {/* OTP Error */}
                      {otpError && (
                        <p className="text-[11px] text-[#cc3333] dark:text-[#ff6b6b] font-[700] m-0">
                          {otpError}
                        </p>
                      )}

                      {/* Verify Button */}
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={!otpFilled || otpLoading}
                        className="border-0 rounded-[10px] p-[12px] bg-[#202b29] dark:bg-[#FACC15] text-white dark:text-black text-[13px] font-[800] cursor-pointer transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#2e3e3a] dark:hover:bg-[#EAB308] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-[7px]"
                      >
                        {otpLoading && (
                          <svg
                            className="animate-spin h-[14px] w-[14px]"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="opacity-25"
                            />
                            <path
                              d="M12 2a10 10 0 019.17 6"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className="opacity-75"
                            />
                          </svg>
                        )}
                        {otpLoading ? "Verifying..." : "Verify email"}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div className="grid gap-[8px]">
                <label
                  htmlFor="password"
                  className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    required
                    disabled={loading}
                    className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] p-[14px_15px] pr-[55px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a09d94] dark:placeholder:text-[#70746d] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[10px] top-[7px] h-[36px] border-0 bg-transparent text-[#70746d] dark:text-[#b8b4ac] text-[12px] font-[700] cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading || otpStep !== "verified"}
                className="border-0 rounded-[12px] p-[15px] bg-[#202b29] dark:bg-[#FACC15] text-white dark:text-black font-[800] cursor-pointer shadow-[0_8px_18px_rgba(32,43,41,0.16)] dark:shadow-[0_8px_18px_rgba(250,204,21,0.1)] transition-all duration-150 hover:-translate-y-[2px] hover:bg-[#30403c] dark:hover:bg-[#EAB308] mt-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-[8px]"
              >
                {loading && (
                  <svg
                    className="animate-spin h-[16px] w-[16px]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-25"
                    />
                    <path
                      d="M12 2a10 10 0 019.17 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                )}
                {loading
                  ? "Creating account..."
                  : otpStep !== "verified"
                    ? "Verify email to continue"
                    : "Create my account"}
              </button>

              {/* Divider */}
              <div className="flex gap-[12px] items-center text-[#a09d94] dark:text-[#b8b4ac] text-[11px] my-[5px] before:h-[1px] before:bg-[#ddd8ce] dark:before:bg-white/10 before:flex-1 after:h-[1px] after:bg-[#ddd8ce] dark:after:bg-white/10 after:flex-1">
                or continue with
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-1 min-[370px]:grid-cols-2 gap-[10px]">
                <button
                  type="button"
                  className="border border-[#d8d3ca] dark:border-white/10 bg-transparent rounded-[11px] p-[12px_9px] text-[#404641] dark:text-[#c5c4bb] text-[12px] font-[700] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-[8px]"
                  onClick={handleGoogleSignup}
                >
                  <svg width="16" height="16" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.4 24.4 0 000 21.56l7.98-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="border border-[#d8d3ca] dark:border-white/10 bg-transparent rounded-[11px] p-[12px_9px] text-[#404641] dark:text-[#c5c4bb] text-[12px] font-[700] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-[8px]"
                  onClick={handleDiscordSignUp}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 127.14 96.36"
                    fill="#5865F2"
                  >
                    <path d="M107.7 8.07A105.15 105.15 0 0081.47 0a72.06 72.06 0 00-3.36 6.83 97.68 97.68 0 00-29.11 0A72.37 72.37 0 0045.64 0a105.89 105.89 0 00-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0032.17 16.15 77.7 77.7 0 006.89-11.11 68.42 68.42 0 01-10.85-5.18c.91-.66 1.8-1.34 2.66-2.03a75.57 75.57 0 0064.32 0c.87.71 1.76 1.39 2.66 2.03a68.68 68.68 0 01-10.87 5.19 77 77 0 006.89 11.1 105.25 105.25 0 0032.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15zM42.45 65.69C36.18 65.69 31 60 31 53.05s5-12.68 11.45-12.68S53.99 46.06 53.9 53.05c0 6.95-5.11 12.64-11.45 12.64zm42.24 0C78.41 65.69 73.25 60 73.25 53.05s5-12.68 11.44-12.68 11.51 5.73 11.44 12.68c0 6.95-5.09 12.64-11.44 12.64z" />
                  </svg>
                  Discord
                </button>
              </div>
            </form>

            {/* Legal Footer */}
            <p className="text-[#98958d] text-[11px] leading-[1.55] text-center mt-[18px]">
              By continuing, you agree to our{" "}
              <Link
                href="#"
                className="text-[#545a53] dark:text-[#c5c4bb] hover:underline hover:text-[#FACC15] dark:hover:text-[#FACC15]"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-[#545a53] dark:text-[#c5c4bb] hover:underline hover:text-[#FACC15] dark:hover:text-[#FACC15]"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
