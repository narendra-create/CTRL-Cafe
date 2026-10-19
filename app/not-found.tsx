import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] mt-15 md:mt-0 bg-[#f4efe7] dark:bg-[#0d0f0f] flex items-center justify-center p-6 font-sans transition-colors duration-300 relative overflow-hidden">

      {/* Background Noise & Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(250,204,21,0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(250,204,21,0.18),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative Rings */}
      <div className="absolute -top-[180px] -left-[180px] w-[480px] h-[480px] rounded-full border border-[rgba(250,204,21,0.14)] dark:border-[rgba(250,204,21,0.2)] pointer-events-none" />
      <div className="absolute -top-[120px] -left-[120px] w-[320px] h-[320px] rounded-full border border-[rgba(250,204,21,0.1)] dark:border-[rgba(250,204,21,0.14)] pointer-events-none" />
      <div className="absolute -bottom-[200px] -right-[200px] w-[520px] h-[520px] rounded-full border border-[rgba(250,204,21,0.12)] dark:border-[rgba(250,204,21,0.18)] pointer-events-none" />
      <div className="absolute -bottom-[130px] -right-[130px] w-[340px] h-[340px] rounded-full border border-[rgba(250,204,21,0.08)] dark:border-[rgba(250,204,21,0.12)] pointer-events-none" />

      {/* Main Card */}
      <main className="relative z-10 w-full max-w-[560px] bg-white dark:bg-[#111414] rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] overflow-hidden">

        {/* Card Top Accent Strip */}
        <div className="h-[3px] w-full bg-[linear-gradient(90deg,transparent,#FACC15_40%,transparent)]" />

        {/* Content Section */}
        <div className="px-[clamp(28px,6vw,56px)] pt-[clamp(36px,6vw,56px)] pb-[clamp(32px,5vw,48px)]">

          {/* Logo */}
          <div className="flex items-center gap-5 font-[800] tracking-[-0.03em] text-[16px] text-[#15191a] dark:text-[#f7f3ed] mb-[40px]">
            <div className="w-[34px] h-[34px] bg-[#FACC15] rounded-[9px_9px_9px_3px] grid place-items-center text-[#15201b] -rotate-6 text-[14px] font-[900] shrink-0 select-none">
              <Image alt="Logo" src={"/CTRL-CAFE-ICON.webp"} width={28} height={28}/>
            </div>
            <span>CTRL-CAFE</span>
          </div>

          {/* 404 Hero Number */}
          <div className="relative mb-15 mt-10">
            <span
              className="text-[clamp(96px,20vw,148px)] font-semibold font-sans leading-none tracking-wide text-[#FACC15] select-none"
              aria-hidden="true"
            >
              404
            </span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(250,204,21,0.2),transparent_65%)] pointer-events-none" />
          </div>

          {/* Headline & Description */}
          <h1 className="text-[clamp(22px,5vw,32px)] font-[800] tracking-[-0.055em] text-[#15191a] dark:text-[#f7f3ed] leading-[1.1] m-0 mb-[14px]">
            Page not found.
            <br />
            <em className="not-italic font-heading text-[#ff876d]">Respawn elsewhere.</em>
          </h1>
          <p className="text-[#77766f] dark:text-[#9a9890] text-[14px] leading-[1.65] m-0 mb-[36px] max-w-[380px]">
            Looks like this route got fragged. The page you&apos;re after
            doesn&apos;t exist — maybe it was moved, deleted, or never spawned
            in the first place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col min-[420px]:flex-row gap-[10px]">
            <Link
              href="/"
              className="flex items-center justify-center gap-[8px] rounded-[12px] px-5 py-1 bg-[#FACC15] text-[#15191a] text-[13px] font-extrabold tracking-[-0.01em] shadow-[0_6px_20px_rgba(250,204,21,0.3)] hover:bg-[#EAB308] hover:-translate-y-[2px] transition-all duration-150 no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M6 1L1 7l5 6M1 7h12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to home
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-[8px] rounded-[12px] px-5 py-2 bg-transparent border border-[#e0dbd2] dark:border-white/10 text-[#1c2422] dark:text-[#c5c4bb] text-[13px] font-[700] tracking-[-0.01em] hover:bg-black/5 dark:hover:bg-white/5 hover:-translate-y-[2px] transition-all duration-150 no-underline"
            >
              Log in instead
            </Link>
          </div>
        </div>

        {/* Footer Strip */}
        <div className="border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] px-[clamp(28px,6vw,56px)] py-[18px] flex items-center justify-between gap-4">
          <p className="text-[#a09d94] dark:text-[#6b6a64] text-[11px] m-0 tracking-[0.02em]">
            Error code: <span className="font-[700] text-[#FACC15]">404</span>
          </p>
          <div className="flex gap-[18px]">
            <span className="text-[11px] font-[700] uppercase tracking-[0.14em] text-[#c5c2ba] dark:text-[#4a4a44]">
              24/7
            </span>
            <span className="text-[11px] font-[700] uppercase tracking-[0.14em] text-[#c5c2ba] dark:text-[#4a4a44]">
              ∞ rematches
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
