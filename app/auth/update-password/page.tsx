"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [checking, setChecking] = useState(true);

  /* Session Guard Section */
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getClaims();
      if (error || !data?.claims) {
        window.location.replace("/auth/login");
      } else {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  /* Password Strength Section */
  const getStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(newPassword);
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][
    strength
  ];
  const strengthColor = [
    "",
    "#ef4444",
    "#f97316",
    "#FACC15",
    "#86efac",
    "#4ade80",
  ][strength];

  /* Update Logic Section (Supabase) */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
    setDone(true);
  };

  /* Guard: block render until session verified */
  if (checking) {
    return (
      <div className="min-h-[100dvh] bg-[#eae5db] dark:bg-[#0e1212] grid place-items-center transition-colors">
        <svg
          className="animate-spin h-[22px] w-[22px] text-[#FACC15]"
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
      </div>
    );
  }

  return (
    /* Page Wrapper */
    <div className="min-h-[100dvh] bg-[#eae5db] dark:bg-[#0e1212] flex flex-col items-center justify-center font-sans relative overflow-hidden px-5 py-12 transition-colors duration-300">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[780px] md:h-[780px] 2xl:w-[900px] 2xl:h-[900px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.12)_0%,transparent_62%)] dark:bg-[radial-gradient(circle,rgba(250,204,21,0.08)_0%,transparent_62%)]" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[340px] h-[340px] md:w-[440px] md:h-[440px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.07)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(250,204,21,0.05)_0%,transparent_70%)]" />
        <div className="absolute left-[-40px] top-[40%] w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full border border-[rgba(180,150,0,0.12)] dark:border-[rgba(250,204,21,0.08)]" />
        <div className="absolute left-[-40px] top-[40%] w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full border border-[rgba(180,150,0,0.08)] dark:border-[rgba(250,204,21,0.05)] translate-x-[45px] translate-y-[45px]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="#FACC15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Card */}
      <main className="relative z-10 w-full max-w-[460px] md:max-w-[500px] 2xl:max-w-[540px]">
        {/* Logo */}
        <div className="flex items-center gap-[10px] font-[800] tracking-[-0.03em] text-[17px] md:text-[19px] text-[#19201f] dark:text-[#f7f3ed] mb-[36px] md:mb-[42px] transition-colors">
          <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] bg-[#FACC15] rounded-[10px_10px_10px_3px] grid place-items-center -rotate-6 overflow-hidden relative shrink-0">
            <Image
              src="/CTRL-CAFE-ICON.webp"
              alt="Icon"
              fill
              className="object-cover"
            />
          </div>
          <span>CTRL-CAFE</span>
        </div>

        {/* Shield Icon Badge */}
        <div className="mb-[28px] md:mb-[32px] flex items-center gap-[14px] md:gap-[16px]">
          <div className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-[16px] bg-[rgba(250,204,21,0.12)] dark:bg-[rgba(250,204,21,0.10)] border border-[rgba(180,150,0,0.22)] dark:border-[rgba(250,204,21,0.18)] grid place-items-center shrink-0">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="md:scale-110"
            >
              <path
                d="M12 2L4 5.5V11c0 4.42 3.41 8.57 8 9.93C16.59 19.57 20 15.42 20 11V5.5L12 2z"
                stroke="#FACC15"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="#FACC15"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-[#b08c00] dark:text-[#FACC15] text-[10px] md:text-[11px] tracking-[0.18em] uppercase font-[800] m-0 mb-[4px] transition-colors">
              Set New Password
            </p>
            <h1 className="text-[28px] md:text-[33px] 2xl:text-[36px] tracking-[-0.06em] m-0 font-[850] text-[#19201f] dark:text-[#f7f3ed] leading-[1] transition-colors">
              {/* leave space for user's heading */}
            </h1>
          </div>
        </div>

        {/* Form Panel */}
        <div className="bg-white dark:bg-[#181e1e] border border-[#ddd8ce] dark:border-white/[0.07] rounded-[22px] p-[28px_24px_30px] md:p-[34px_32px_36px] 2xl:p-[38px_36px_40px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)] transition-colors duration-300">
          {done ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-[52px] h-[52px] md:w-[58px] md:h-[58px] rounded-full bg-[rgba(74,222,128,0.12)] border border-[rgba(34,180,90,0.25)] dark:border-[rgba(74,222,128,0.25)] grid place-items-center mx-auto mb-[18px]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-[#19201f] dark:text-[#f7f3ed] text-[18px] md:text-[20px] font-[800] tracking-[-0.04em] m-0 mb-[8px] transition-colors">
                Password updated!
              </h2>
              <p className="text-[#5a6360] dark:text-[#7a8380] text-[14px] md:text-[15px] leading-[1.6] m-0 mb-[24px] transition-colors">
                Your password has been changed. You can now log in with your new
                credentials.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-[6px] rounded-[12px] px-[22px] py-[13px] md:py-[14px] text-[14px] md:text-[15px] bg-[#1c2422] dark:bg-[#FACC15] text-white dark:text-black font-[800] hover:bg-[#2e3e3a] dark:hover:bg-[#EAB308] transition-colors shadow-[0_6px_18px_rgba(28,36,34,0.16)] dark:shadow-[0_6px_18px_rgba(250,204,21,0.18)]"
              >
                Go to login
              </Link>
            </div>
          ) : (
            /* Password Form */
            <form
              className="grid gap-[18px] md:gap-[20px]"
              onSubmit={handleSubmit}
            >
              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-[10px] bg-[#ff4d4d]/10 border border-[#ff4d4d]/25 rounded-[12px] p-[12px_15px]">
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
                  <p className="m-0 text-[13px] text-[#cc2200] dark:text-[#ff6b6b] font-[600] flex-1">
                    {error}
                  </p>
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
                Choose a strong password you haven&apos;t used before. At least
                8 characters.
              </p>

              {/* New Password Field */}
              <div className="grid gap-[8px] md:gap-[9px]">
                <label
                  htmlFor="new-password"
                  className="text-[13px] md:text-[14px] font-[800] text-[#434943] dark:text-[#c5c4bb] transition-colors"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    name="new-password"
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    required
                    disabled={loading}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-[#d0cac0] dark:border-white/10 bg-[#faf7f2] dark:bg-white/5 rounded-[12px] p-[14px_55px_14px_15px] md:p-[15px_60px_15px_16px] text-[15px] md:text-[16px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a5a099] dark:placeholder:text-[#70746d] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 border-0 bg-transparent text-[#7a8078] dark:text-[#70746d] text-[12px] md:text-[13px] font-[700] cursor-pointer hover:text-[#1c2422] dark:hover:text-[#c5c4bb] transition-colors"
                  >
                    {showNew ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="grid gap-[6px]">
                    <div className="flex gap-[4px]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-[3px] flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor:
                              i <= strength
                                ? strengthColor
                                : "rgba(0,0,0,0.10)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[12px] md:text-[13px] font-[700] m-0 transition-colors"
                      style={{ color: strengthColor }}
                    >
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="grid gap-[8px] md:gap-[9px]">
                <label
                  htmlFor="confirm-password"
                  className="text-[13px] md:text-[14px] font-[800] text-[#434943] dark:text-[#c5c4bb] transition-colors"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border rounded-[12px] p-[14px_55px_14px_15px] md:p-[15px_60px_15px_16px] text-[15px] md:text-[16px] bg-[#faf7f2] dark:bg-white/5 outline-none transition-all duration-200 font-sans placeholder:text-[#a5a099] dark:placeholder:text-[#70746d] disabled:opacity-50 disabled:cursor-not-allowed ${
                      confirmPassword && confirmPassword !== newPassword
                        ? "text-[#1c2422] dark:text-[#f7f3ed] border-[#ff4d4d]/50 focus:border-[#ff4d4d] focus:shadow-[0_0_0_4px_rgba(255,77,77,0.08)]"
                        : confirmPassword && confirmPassword === newPassword
                          ? "text-[#1c2422] dark:text-[#f7f3ed] border-[#4ade80]/40 focus:border-[#4ade80] focus:shadow-[0_0_0_4px_rgba(74,222,128,0.08)]"
                          : "text-[#1c2422] dark:text-[#f7f3ed] border-[#d0cac0] dark:border-white/10 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 border-0 bg-transparent text-[#7a8078] dark:text-[#70746d] text-[12px] md:text-[13px] font-[700] cursor-pointer hover:text-[#1c2422] dark:hover:text-[#c5c4bb] transition-colors"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Match Hint */}
                {confirmPassword && (
                  <p
                    className="text-[12px] md:text-[13px] font-[700] m-0 transition-colors"
                    style={{
                      color:
                        confirmPassword === newPassword ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {confirmPassword === newPassword
                      ? "Passwords match ✓"
                      : "Passwords don't match"}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="border-0 rounded-[12px] p-[15px] md:p-[16px] text-[15px] md:text-[16px] bg-[#1c2422] dark:bg-[#FACC15] text-white dark:text-black font-[800] cursor-pointer shadow-[0_8px_22px_rgba(28,36,34,0.16)] dark:shadow-[0_8px_22px_rgba(250,204,21,0.18)] transition-all duration-150 hover:-translate-y-[2px] hover:bg-[#2e3e3a] dark:hover:bg-[#EAB308] mt-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-[8px]"
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
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-[#7a8078] dark:text-[#4a504e] text-[12px] md:text-[13px] leading-[1.55] text-center mt-[20px] md:mt-[24px] transition-colors">
          Remembered it?{" "}
          <Link
            href="/auth/login"
            className="text-[#3d4a47] dark:text-[#7a8380] hover:text-[#b08c00] dark:hover:text-[#FACC15] underline underline-offset-[3px] transition-colors"
          >
            Back to login
          </Link>
        </p>
      </main>
    </div>
  );
}
