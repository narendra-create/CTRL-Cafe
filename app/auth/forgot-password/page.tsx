"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  /* Reset Logic Section (Supabase) */
  const handleSubmit = async (formdata: FormData) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      formdata.get("email") as string,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      },
    );
    if (error) setError(error.message);
    setLoading(false);
    setSent(true);
  };

  return (
    /* Page Wrapper */
    <div className="min-h-[100dvh] bg-[#eae5db] dark:bg-[#0e1212] flex flex-col items-center justify-center font-sans relative overflow-hidden px-5 py-12 transition-colors duration-300">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] md:w-[700px] md:h-[700px] 2xl:w-[860px] 2xl:h-[860px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.13)_0%,transparent_65%)] dark:bg-[radial-gradient(circle,rgba(250,204,21,0.10)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(250,204,21,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-[30%] right-[-60px] w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full border border-[rgba(180,160,40,0.14)] dark:border-[rgba(250,204,21,0.09)]" />
        <div className="absolute top-[30%] right-[-60px] w-[140px] h-[140px] md:w-[190px] md:h-[190px] rounded-full border border-[rgba(180,160,40,0.09)] dark:border-[rgba(250,204,21,0.06)] translate-x-[45px] translate-y-[45px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FACC15" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Card */}
      <main className="relative z-10 w-full max-w-[460px] md:max-w-[500px] 2xl:max-w-[540px]">

        {/* Logo */}
        <div className="flex items-center gap-[10px] font-[800] tracking-[-0.03em] text-[17px] md:text-[19px] text-[#19201f] dark:text-[#f7f3ed] mb-[36px] md:mb-[42px] transition-colors">
          <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] bg-[#FACC15] rounded-[10px_10px_10px_3px] grid place-items-center -rotate-6 overflow-hidden relative shrink-0">
            <Image src="/CTRL-CAFE-ICON.webp" alt="Icon" fill className="object-cover" />
          </div>
          <span>CTRL-CAFE</span>
        </div>

        {/* Lock Icon Badge */}
        <div className="mb-[28px] md:mb-[32px] flex items-center gap-[14px] md:gap-[16px]">
          <div className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-[16px] bg-[rgba(250,204,21,0.12)] dark:bg-[rgba(250,204,21,0.10)] border border-[rgba(180,150,0,0.22)] dark:border-[rgba(250,204,21,0.18)] grid place-items-center shrink-0">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="md:scale-110">
              <rect x="3" y="11" width="18" height="11" rx="2.5" stroke="#FACC15" strokeWidth="1.6" />
              <path d="M7 11V7.5a5 5 0 0 1 10 0V11" stroke="#FACC15" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1.4" fill="#FACC15" />
            </svg>
          </div>
          <div>
            <p className="text-[#b08c00] dark:text-[#FACC15] text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-[800] m-0 mb-[4px] transition-colors">
              Account Recovery
            </p>
            <h1 className="text-[28px] md:text-[33px] 2xl:text-[36px] tracking-[-0.06em] m-0 font-[850] text-[#19201f] dark:text-[#f7f3ed] leading-[1] transition-colors">
              {/* leave space for user's heading */}
            </h1>
          </div>
        </div>

        {/* Form Panel */}
        <div className="bg-white dark:bg-[#181e1e] border border-[#ddd8ce] dark:border-white/[0.07] rounded-[22px] p-[28px_24px_30px] md:p-[34px_32px_36px] 2xl:p-[38px_36px_40px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] transition-colors duration-300">

          {sent ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-[52px] h-[52px] md:w-[58px] md:h-[58px] rounded-full bg-[rgba(250,204,21,0.12)] border border-[rgba(180,150,0,0.25)] dark:border-[rgba(250,204,21,0.25)] grid place-items-center mx-auto mb-[18px]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-[#19201f] dark:text-[#f7f3ed] text-[18px] md:text-[20px] font-[800] tracking-[-0.04em] m-0 mb-[8px] transition-colors">
                Check your inbox
              </h2>
              <p className="text-[#5a6360] dark:text-[#7a8380] text-[14px] md:text-[15px] leading-[1.6] m-0 mb-[24px] transition-colors">
                If that email is in our system, a reset link is on its way. Check your spam folder too.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-[6px] text-[14px] md:text-[15px] text-[#b08c00] dark:text-[#FACC15] font-[700] underline underline-offset-[4px] hover:text-[#EAB308] transition-colors"
              >
                Back to login
              </Link>
            </div>
          ) : (
            /* Email Form */
            <form className="grid gap-[18px] md:gap-[20px]" action={handleSubmit}>

              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-[10px] bg-[#ff4d4d]/10 border border-[#ff4d4d]/25 rounded-[12px] p-[12px_15px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <circle cx="8" cy="8" r="7" stroke="#ff4d4d" strokeWidth="1.5" />
                    <path d="M8 4.5v4" stroke="#ff4d4d" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="11" r="0.75" fill="#ff4d4d" />
                  </svg>
                  <p className="m-0 text-[13px] text-[#cc2200] dark:text-[#ff6b6b] font-[600] flex-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="border-0 bg-transparent text-[#cc2200] dark:text-[#ff6b6b] text-[18px] leading-none cursor-pointer p-0 hover:opacity-60 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Helper Text */}
              <p className="m-0 text-[#5a6360] dark:text-[#7a8380] text-[14px] md:text-[15px] leading-[1.65] transition-colors">
                Enter the email tied to your account and we&apos;ll send a reset link your way.
              </p>

              {/* Email Field */}
              <div className="grid gap-[8px] md:gap-[9px]">
                <label htmlFor="email" className="text-[13px] md:text-[14px] font-[800] text-[#434943] dark:text-[#c5c4bb] transition-colors">
                  Email address
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full border border-[#d0cac0] dark:border-white/10 bg-[#faf7f2] dark:bg-white/5 rounded-[12px] p-[14px_15px] md:p-[15px_16px] text-[15px] md:text-[16px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a5a099] dark:placeholder:text-[#70746d] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="border-0 rounded-[12px] p-[15px] md:p-[16px] text-[15px] md:text-[16px] bg-[#1c2422] dark:bg-[#FACC15] text-white dark:text-black font-[800] cursor-pointer shadow-[0_8px_22px_rgba(28,36,34,0.16)] dark:shadow-[0_8px_22px_rgba(250,204,21,0.18)] transition-all duration-150 hover:-translate-y-[2px] hover:bg-[#2e3e3a] dark:hover:bg-[#EAB308] mt-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-[8px]"
              >
                {loading && (
                  <svg className="animate-spin h-[16px] w-[16px]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                    <path d="M12 2a10 10 0 019.17 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                )}
                {loading ? "Sending link..." : "Send reset link"}
              </button>

              {/* Divider */}
              <div className="flex gap-[12px] items-center text-[#9a9890] dark:text-[#4a504e] text-[12px] md:text-[13px] before:h-px before:bg-[#ddd8ce] dark:before:bg-white/8 before:flex-1 after:h-px after:bg-[#ddd8ce] dark:after:bg-white/8 after:flex-1 transition-colors">
                or
              </div>

              {/* Back to Login */}
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-[7px] border border-[#d0cac0] dark:border-white/10 rounded-[12px] p-[13px] md:p-[14px] text-[#3d4a47] dark:text-[#c5c4bb] text-[14px] md:text-[15px] font-[700] hover:bg-[#f0ebe2] dark:hover:bg-white/5 hover:border-[#c0b9ae] dark:hover:border-white/15 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to login
              </Link>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-[#7a8078] dark:text-[#4a504e] text-[12px] md:text-[13px] leading-[1.55] text-center mt-[20px] md:mt-[24px] transition-colors">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#3d4a47] dark:text-[#7a8380] hover:text-[#b08c00] dark:hover:text-[#FACC15] underline underline-offset-[3px] transition-colors"
          >
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
