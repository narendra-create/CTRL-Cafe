"use client";

import Image from "next/image";
import Link from "next/link";

interface AlreadyLoggedInProps {
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  onSignOut?: () => void;
}

/* Section: Already Logged In View */
export default function AlreadyLoggedIn({
  name = "Gamer",
  email = "player@ctrlcafe.com",
  avatarUrl,
  role = "User",
  onSignOut,
}: AlreadyLoggedInProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-[100dvh] bg-[#15191a] md:bg-[#d8d1c5] dark:md:bg-[#0a0a0a] md:p-[clamp(14px,3vw,38px)] 2xl:p-14 block md:grid md:place-items-center font-sans transition-colors duration-300">
      <main className="w-full max-w-[1180px] 2xl:max-w-[1400px] md:mt-20 min-h-screen md:min-h-[min(760px,calc(100vh-28px))] 2xl:min-h-[820px] block md:grid md:grid-cols-[1.04fr_0.96fr] 2xl:grid-cols-[1.08fr_0.92fr] bg-[#15191a] md:rounded-[28px] 2xl:rounded-[36px] overflow-hidden md:shadow-[0_30px_90px_rgba(0,0,0,0.34)] 2xl:shadow-[0_40px_120px_rgba(0,0,0,0.45)] relative">
        
        {/* Showcase Section */}
        <section className="flex flex-col justify-between relative overflow-hidden px-[23px] pt-[25px] pb-[28px] min-h-[265px] md:p-[clamp(26px,4vw,58px)] md:min-h-[700px] 2xl:p-18 2xl:min-h-[820px] bg-[radial-gradient(circle_at_83%_12%,rgba(250,204,21,0.22),transparent_30%),linear-gradient(145deg,#242c2c,#121718_70%)] text-[#f7f3ed]">
          
          {/* Showcase Background Rings */}
          <div className="absolute border border-[rgba(250,204,21,0.16)] rounded-full pointer-events-none w-[330px] h-[330px] -right-[175px] -bottom-[190px] md:w-[540px] md:h-[540px] md:-right-[260px] md:-bottom-[210px] 2xl:w-[680px] 2xl:h-[680px] 2xl:-right-[300px] 2xl:-bottom-[240px]"></div>
          <div className="absolute border border-[rgba(250,204,21,0.16)] rounded-full pointer-events-none w-[230px] h-[230px] -right-[115px] -bottom-[135px] md:w-[370px] md:h-[370px] md:-right-[170px] md:-bottom-[125px] 2xl:w-[480px] 2xl:h-[480px] 2xl:-right-[200px] 2xl:-bottom-[140px]"></div>

          {/* Showcase Content */}
          <div className="relative z-10 max-w-[490px] 2xl:max-w-[560px] mt-21.25 md:mt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 mb-[18px] 2xl:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
              <p className="text-[#FACC15] text-[11px] md:text-[12px] 2xl:text-[13px] tracking-[0.16em] uppercase font-[800] m-0">
                Session Active
              </p>
            </div>
            <h1 className="text-[38px] min-[370px]:text-[42px] md:text-[clamp(42px,5.2vw,76px)] 2xl:text-[80px] leading-[0.93] tracking-[-0.075em] m-0 mb-[12px] md:mb-[23px] 2xl:mb-7 font-[680]">
              You&apos;re in.
              <br />
              <em className="not-italic text-[#FACC15]">Logged In.</em>
            </h1>
            <p className="text-[#c5c4bb] leading-[1.65] text-[13px] md:text-[15px] 2xl:text-[17px] max-w-[310px] md:max-w-[395px] 2xl:max-w-[460px] m-0">
              You are already logged into CTRL-CAFE. Jump back into your station, explore lounge perks, or manage your account.
            </p>
          </div>

          {/* Showcase Stats Section */}
          <div className="hidden md:flex gap-[30px] 2xl:gap-12 relative z-10">
            <div>
              <strong className="block text-[21px] 2xl:text-[26px] tracking-[-0.04em] text-emerald-400">
                Online
              </strong>
              <span className="text-[11px] 2xl:text-[12px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">
                Session Status
              </span>
            </div>
            <div>
              <strong className="block text-[21px] 2xl:text-[26px] tracking-[-0.04em]">
                24/7
              </strong>
              <span className="text-[11px] 2xl:text-[12px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">
                Lounge Access
              </span>
            </div>
            <div className="hidden 2xl:block">
              <strong className="block text-[26px] tracking-[-0.04em] text-[#FACC15]">
                CTRL Pass
              </strong>
              <span className="text-[12px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">
                Tier Verified
              </span>
            </div>
          </div>
        </section>

        {/* Account Hub Section */}
        <section className="bg-[#f4efe7] dark:bg-[#15191a] text-[#19201f] dark:text-[#f7f3ed] p-[31px_23px_42px] md:p-[clamp(27px,5vw,70px)] 2xl:p-18 flex items-start md:items-center min-h-[calc(100dvh-265px)] md:min-h-0 transition-colors duration-300">
          <div className="w-full max-w-[390px] 2xl:max-w-[460px] mx-auto flex flex-col justify-center">
            
            {/* Section Header */}
            <div className="mb-[24px] md:mb-[30px] 2xl:mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] 2xl:text-[12px] font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Logged In
              </div>
              <h2 className="text-[27px] min-[370px]:text-[29px] md:text-[32px] 2xl:text-[38px] tracking-[-0.06em] m-0 mb-[6px] 2xl:mb-2 font-[800]">
                Welcome back
              </h2>
              <p className="m-0 text-[#77766f] dark:text-[#b8b4ac] text-[13px] md:text-[14px] 2xl:text-[15px]">
                Your account is authenticated and ready to go.
              </p>
            </div>

            {/* User Identity Card */}
            <div className="bg-[#fffdf9] dark:bg-white/[0.04] border border-[#d7d2c8] dark:border-white/10 rounded-[18px] 2xl:rounded-[22px] p-[16px_18px] md:p-[18px_20px] 2xl:p-6 mb-[22px] 2xl:mb-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FACC15] via-[#ff876d] to-[#FACC15]"></div>
              
              <div className="flex items-center gap-3.5 2xl:gap-4.5">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={name}
                      width={52}
                      height={52}
                      className="w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px] rounded-full object-cover border-2 border-[#FACC15]"
                    />
                  ) : (
                    <div className="w-[46px] h-[46px] md:w-[52px] md:h-[52px] 2xl:w-[60px] 2xl:h-[60px] rounded-full bg-[#202b29] dark:bg-[#FACC15] text-white dark:text-black font-[800] text-[15px] md:text-[17px] 2xl:text-[20px] flex items-center justify-center border-2 border-[#FACC15]/40 shadow-inner">
                      {initials}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 2xl:w-3.5 2xl:h-3.5 rounded-full bg-emerald-500 border-2 border-[#fffdf9] dark:border-[#15191a]"></span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] md:text-[16px] 2xl:text-[18px] font-[800] text-[#1c2422] dark:text-[#f7f3ed] truncate m-0">
                      {name}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-[6px] bg-[#FACC15]/15 text-[#856700] dark:text-[#FACC15] text-[10px] 2xl:text-[11px] font-[800] uppercase tracking-wide">
                      {role}
                    </span>
                  </div>
                  <p className="text-[12px] md:text-[13px] 2xl:text-[14px] text-[#77766f] dark:text-[#b8b4ac] truncate m-0 mt-0.5 font-mono">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Navigation Actions */}
            <div className="grid gap-[10px] 2xl:gap-3 mb-[18px] 2xl:mb-6">
              <Link
                href="/Dashboard"
                className="w-full border-0 rounded-[12px] 2xl:rounded-[14px] p-[14px_16px] md:p-[15px_18px] 2xl:p-[18px_20px] bg-[#202b29] dark:bg-[#FACC15] text-white dark:text-black font-[800] text-[13px] md:text-[14px] 2xl:text-[15px] cursor-pointer shadow-[0_8px_18px_rgba(32,43,41,0.16)] dark:shadow-[0_8px_18px_rgba(250,204,21,0.1)] transition-all duration-150 hover:-translate-y-[2px] hover:bg-[#30403c] dark:hover:bg-[#EAB308] flex items-center justify-center gap-2"
              >
                <span>Continue to Dashboard</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="2xl:w-5 2xl:h-5"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/"
                className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] 2xl:rounded-[14px] p-[13px_15px] md:p-[14px_16px] 2xl:p-[16px_18px] text-[#1c2422] dark:text-[#f7f3ed] font-[700] text-[13px] md:text-[14px] 2xl:text-[15px] cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="2xl:w-5 2xl:h-5 text-[#FACC15]"
                >
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22V12h6v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Back to Homepage</span>
              </Link>
            </div>

            {/* Secondary Navigation Actions */}
            <div className="grid grid-cols-2 gap-[10px] 2xl:gap-3 mb-[22px] 2xl:mb-7">
              <Link
                href="/Plans"
                className="border border-[#d8d3ca] dark:border-white/10 bg-transparent rounded-[11px] 2xl:rounded-[13px] p-[11px_10px] 2xl:p-[14px_12px] text-[#404641] dark:text-[#c5c4bb] text-[12px] 2xl:text-[13px] font-[700] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-center"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="2xl:w-4 2xl:h-4 text-[#FACC15] shrink-0"
                >
                  <rect
                    x="2"
                    y="7"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>View Plans</span>
              </Link>

              <Link
                href="/Features/Prices"
                className="border border-[#d8d3ca] dark:border-white/10 bg-transparent rounded-[11px] 2xl:rounded-[13px] p-[11px_10px] 2xl:p-[14px_12px] text-[#404641] dark:text-[#c5c4bb] text-[12px] 2xl:text-[13px] font-[700] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-center"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="2xl:w-4 2xl:h-4 text-[#FACC15] shrink-0"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Price List</span>
              </Link>
            </div>

            {/* Account Switcher Section */}
            <div className="pt-2 border-t border-[#ddd8ce] dark:border-white/10 flex flex-col items-center gap-2">
              <p className="text-[12px] 2xl:text-[13px] text-[#77766f] dark:text-[#b8b4ac] m-0 text-center">
                Want to sign in with a different account?
              </p>
              
              {onSignOut ? (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="border-0 bg-transparent text-[#1b2524] dark:text-[#FACC15] font-[800] text-[12px] 2xl:text-[13px] py-1 underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Sign out of this session
                </button>
              ) : (
                <Link
                  href="/"
                  className="border-0 bg-transparent text-[#1b2524] dark:text-[#FACC15] font-[800] text-[12px] 2xl:text-[13px] py-1 underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Switch profile
                </Link>
              )}
            </div>

            {/* Footer Note Section */}
            <p className="text-[#98958d] text-[11px] 2xl:text-[12px] leading-[1.55] text-center mt-[18px] 2xl:mt-6 mb-0">
              CTRL-CAFE Lounge • High performance rigs &amp; friendly rivalry.
            </p>

          </div>
        </section>

      </main>
    </div>
  );
}
