"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

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
              <Image src="/CTRL-CAFE-ICON.webp" alt="Icon" fill className="object-cover" />
            </div>
            <span>CTRL-CAFE</span>
          </div>

          <div className="relative z-10 max-w-[490px] mt-[34px] md:mt-0">
            <p className="text-[#FACC15] text-[11px] tracking-[0.16em] uppercase font-[800] m-0 mb-[18px]">Your seat is waiting</p>
            <h1 className="text-[38px] min-[370px]:text-[42px] md:text-[clamp(42px,5.2vw,76px)] leading-[0.93] tracking-[-0.075em] m-0 mb-[12px] md:mb-[23px] font-[850]">
              Play more.<br />
              <em className="not-italic text-[#ff876d]">Stay awhile.</em>
            </h1>
            <p className="text-[#c5c4bb] leading-[1.65] text-[13px] md:text-[15px] max-w-[310px] md:max-w-[395px] m-0">
              A cozy gaming lounge for big wins, friendly rivalry, and that one more round feeling.
            </p>
          </div>

          <div className="hidden md:flex gap-[30px] relative z-10">
            <div>
              <strong className="block text-[21px] tracking-[-0.04em]">24/7</strong>
              <span className="text-[11px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">good vibes</span>
            </div>
            <div>
              <strong className="block text-[21px] tracking-[-0.04em]">∞</strong>
              <span className="text-[11px] text-[#929b97] uppercase tracking-[0.1em] mt-1 block">rematches</span>
            </div>
          </div>
        </section>

        {/* Auth Content Section */}
        <section className="bg-[#f4efe7] dark:bg-[#15191a] text-[#19201f] dark:text-[#f7f3ed] p-[31px_23px_42px] md:p-[clamp(27px,5vw,70px)] flex items-start md:items-center min-h-[calc(100dvh-265px)] md:min-h-0 transition-colors duration-300">
          <div className="w-full max-w-[390px] mx-auto">
            <div className="flex flex-col min-[370px]:flex-row justify-between items-start mb-[28px] md:mb-[37px]">
              <div>
                <h2 className="text-[29px] md:text-[32px] tracking-[-0.06em] m-0 mb-[8px] font-[800]">Create account</h2>
                <p className="m-0 text-[#77766f] dark:text-[#b8b4ac] text-[14px]">Your next great session starts here.</p>
              </div>
              <div className="text-[13px] text-[#6d6d65] dark:text-[#b8b4ac] text-left min-[370px]:text-right mt-[14px] min-[370px]:mt-0">
                <span>Already a member?</span>
                <Link href="/auth/login" className="block border-0 bg-transparent text-[#1b2524] dark:text-[#FACC15] font-[800] py-[5px] underline underline-offset-[4px]">
                  Log in
                </Link>
              </div>
            </div>

            <form className="grid gap-[17px]">
              {/* Register Logic Section (Supabase/API) */}

              <div className="grid gap-[8px]">
                <label htmlFor="name" className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb]">Your name</label>
                <input 
                  id="name" 
                  type="text" 
                  autoComplete="name" 
                  placeholder="Alex Morgan" 
                  required 
                  className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] p-[14px_15px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a09d94] dark:placeholder:text-[#70746d]" 
                />
              </div>

              <div className="grid gap-[8px]">
                <label htmlFor="email" className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb]">Email address</label>
                <input 
                  id="email" 
                  type="email" 
                  autoComplete="email" 
                  placeholder="you@example.com" 
                  required 
                  className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] p-[14px_15px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a09d94] dark:placeholder:text-[#70746d]" 
                />
              </div>

              <div className="grid gap-[8px]">
                <label htmlFor="password" className="text-[12px] font-[800] text-[#434943] dark:text-[#c5c4bb]">Password</label>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete="new-password" 
                    placeholder="Create a password" 
                    required 
                    className="w-full border border-[#d7d2c8] dark:border-white/10 bg-[#fffdf9] dark:bg-white/5 rounded-[12px] p-[14px_15px] pr-[55px] text-[#1c2422] dark:text-[#f7f3ed] outline-none transition-all duration-200 focus:border-[#FACC15] dark:focus:border-[#FACC15] focus:shadow-[0_0_0_4px_rgba(250,204,21,0.13)] font-sans placeholder:text-[#a09d94] dark:placeholder:text-[#70746d]" 
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

              <button 
                type="submit" 
                className="border-0 rounded-[12px] p-[15px] bg-[#202b29] dark:bg-[#FACC15] text-white dark:text-black font-[800] cursor-pointer shadow-[0_8px_18px_rgba(32,43,41,0.16)] dark:shadow-[0_8px_18px_rgba(250,204,21,0.1)] transition-all duration-150 hover:-translate-y-[2px] hover:bg-[#30403c] dark:hover:bg-[#EAB308] mt-1"
              >
                Create my account
              </button>

              <div className="flex gap-[12px] items-center text-[#a09d94] dark:text-[#b8b4ac] text-[11px] my-[5px] before:h-[1px] before:bg-[#ddd8ce] dark:before:bg-white/10 before:flex-1 after:h-[1px] after:bg-[#ddd8ce] dark:after:bg-white/10 after:flex-1">
                or continue with
              </div>

              <div className="grid grid-cols-1 min-[370px]:grid-cols-2 gap-[10px]">
                <button type="button" className="border border-[#d8d3ca] dark:border-white/10 bg-transparent rounded-[11px] p-[12px_9px] text-[#404641] dark:text-[#c5c4bb] text-[12px] font-[700] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Google</button>
                <button type="button" className="border border-[#d8d3ca] dark:border-white/10 bg-transparent rounded-[11px] p-[12px_9px] text-[#404641] dark:text-[#c5c4bb] text-[12px] font-[700] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Discord</button>
              </div>
            </form>

            <p className="text-[#98958d] text-[11px] leading-[1.55] text-center mt-[18px]">
              By continuing, you agree to our <Link href="#" className="text-[#545a53] dark:text-[#c5c4bb] hover:underline hover:text-[#FACC15] dark:hover:text-[#FACC15]">Terms</Link> and <Link href="#" className="text-[#545a53] dark:text-[#c5c4bb] hover:underline hover:text-[#FACC15] dark:hover:text-[#FACC15]">Privacy Policy</Link>.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
