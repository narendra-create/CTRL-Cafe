"use client";

import { motion, MotionConfig } from "motion/react";

type CtrlCafeLoaderProps = {
  label?: string;
  size?: number;
  className?: string;
};

export default function CtrlCafeLoader({
  label = "Initializing Session",
  size = 100,
  className = "",
}: CtrlCafeLoaderProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div
        role="status"
        aria-live="polite"
        className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="overflow-visible"
        >
          {/* Background dotted ring */}
          <circle
            cx="60"
            cy="60"
            r="49"
            stroke="#45413A"
            strokeWidth="3"
            strokeDasharray="3 7"
          />

          {/* Rotating yellow ring */}
          <motion.circle
            cx="60"
            cy="60"
            r="49"
            stroke="#F5C451"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="77 231"
            style={{
              transformOrigin: "60px 60px",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
            }}
          />

          {/* CTRL keycap */}
          <motion.g
            style={{
              transformOrigin: "60px 60px",
            }}
            animate={{
              scale: [1, 0.97, 1],
            }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            {/* Key body */}
            <rect
              x="29"
              y="40"
              width="62"
              height="43"
              rx="10"
              fill="#101010"
              stroke="#79612E"
              strokeWidth="1.5"
            />

            {/* Subtle top reflection */}
            <path
              d="M39 43 Q60 39 81 43"
              stroke="#FFE09A"
              strokeOpacity="0.3"
              fill="none"
            />

            {/* Key label */}
            <text
              x="60"
              y="66"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              letterSpacing="2"
              fill="#F5C451"
            >
              CTRL
            </text>

            {/* Bottom key detail */}
            <rect x="46" y="74" width="28" height="2" rx="1" fill="#66542C" />
          </motion.g>
        </svg>

        {/* Loading label */}
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5C451]">
          {label}
        </span>
      </div>
    </MotionConfig>
  );
}
