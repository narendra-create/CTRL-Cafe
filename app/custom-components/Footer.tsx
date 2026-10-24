import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    // Main Footer Container
    <footer className="w-full mt-auto border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-md transition-colors">
      <div className="max-w-7xl md:max-w-7xl 2xl:max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 w-fit group"
            >
              <div className="bg-yellow-400 dark:bg-yellow-500 rounded-xl p-1 transition-transform group-hover:scale-105 duration-200">
                <Image
                  src="/CTRL-CAFE-ICON.webp"
                  alt="CTRL"
                  width={34}
                  height={34}
                  className="rounded-lg"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                CTRL-CAFE
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              Stations Online • Open Daily 10 AM - Midnight
            </div>

            <p className="font-sans text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              High frames, fresh brew, zero lag. Your ultimate gaming lounge to
              squad up, compete, and take CTRL.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
                  CTRL
                </kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
                  PLAY
                </kbd>
                <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                  • Ready for your squad
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Explore Section */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                Play & Rates
              </h4>
              <ul className="flex flex-col gap-2.5 font-sans text-sm">
                <li>
                  <Link
                    href="/games"
                    className="group inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    <span>Games</span>
                    <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Prices"
                    className="group inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    <span>Prices</span>
                    <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/book"
                    className="group inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    <span>Book a Seat</span>
                    <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Legal Section */}
            <div className="flex flex-col gap-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                Support & Policy
              </h4>
              <ul className="flex flex-col gap-2.5 font-sans text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    <span>Contact Us</span>
                    <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="group inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    <span>Privacy Policy</span>
                    <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="group inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    <span>Terms of Condition</span>
                    <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Lounge Info Section */}
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                The Lounge
              </h4>
              <div className="flex flex-col gap-2.5 font-sans text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>PC • PS5 • Arcade • VR Zone</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>Mon - Fri: 10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>
                    <b>↳</b>
                  </span>
                  <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>Sat & Sun: 9:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <Link
                    href="/contact"
                    className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                  >
                    Direct Lounge Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright Section */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-sans text-zinc-500 dark:text-zinc-400">
            <span>
              © {new Date().getFullYear()} CTRL-CAFE. All rights reserved.
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">
              •
            </span>
            <span>Crafted for gamers, creators & night owls.</span>
          </div>

          {/* Quick Legal Strip */}
          <div className="flex items-center gap-5 text-xs font-sans text-zinc-500 dark:text-zinc-400">
            <Link
              href="/privacy-policy"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
