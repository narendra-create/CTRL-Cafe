import type { DeviceType } from "@/types/bookingTypes";

/* ─────────────────────────────────────────────
   Shared Interfaces
───────────────────────────────────────────── */

export interface StationSetup {
  id: string;
  name: string;
  stationNumber: number;
  players: number;
  maxPlayers: number;
}

export interface DeviceSetupCard {
  id: string;
  deviceType: "CONSOLE" | "PC" | "ARCADE" | "VR";
  title: string;
  count: number;
  image: string;
  tagline: string;
  features: string[];
  stations: StationSetup[];
}

export interface SnackVisualItem {
  id: string | number;
  name: string;
  quantity: number;
  serves: string;
  category: string;
  imageUrl: string;
  prepNote: string;
}

export interface RewardsSummary {
  currentPoints: number;
  pointsPerHour: number;
  hoursBooked: number;
  totalPointsEarned: number;
  goalForFreeHour: number;
  pointsRemainingForFreeHour: number;
  perks: string[];
}

export interface RazorpayBriefing {
  provider: string;
  encryption: string;
  supportedMethods: Array<{
    category: string;
    description: string;
  }>;
  guarantees: string[];
}

export interface BookingReviewData {
  schedule: {
    dateFormatted: string;
    isoDate: string;
    startsAt: string;
    endsAt: string;
    durationFormatted: string;
    durationHours: number;
    totalPlayers: number;
    arrivalWindow: string;
  };
  deviceSetups: DeviceSetupCard[];
  snacks: SnackVisualItem[];
  rewards: RewardsSummary;
  paymentBriefing: RazorpayBriefing;
}

/* ─────────────────────────────────────────────
   Static Device Metadata (image, tagline, features per arena type)
   Dynamic fields (count, stations, title) come from context at runtime.
───────────────────────────────────────────── */

export const DEVICE_STATIC: Record<
  DeviceType,
  { image: string; tagline: string; features: string[] }
> = {
  CONSOLE: {
    image: "/console-cutout.webp",
    tagline: "Big-screen co-op & rivalry setups",
    features: [
      "4K 120Hz Low-Latency Gaming Screens",
      "DualSense Wireless Haptic Controllers",
    ],
  },
  PC: {
    image: "/pc-cutout.webp",
    tagline: "High-FPS precision esports rig",
    features: [
      "RTX 4060 GPU · 240Hz Fast IPS Display",
      "Mechanical Linear Switch Keyboard & Ultralight Mouse",
    ],
  },
  ARCADE: {
    image: "/arcade-cutout.webp",
    tagline: "Classic cabinets, new rivalries",
    features: [
      "Dedicated Arcade Joystick & Button Panel",
      "Racing Wheels & Fighting Sticks Available",
    ],
  },
  VR: {
    image: "/vr-cutout.webp",
    tagline: "Full-room immersive VR experience",
    features: [
      "Meta Quest Pro / PSVR2 Headsets",
      "Full-Room Motion Tracking",
    ],
  },
};

/* ─────────────────────────────────────────────
   Static Rewards Config (points/hour, goal, perks)
   Dynamic fields (hoursBooked, totalPointsEarned, pointsRemainingForFreeHour)
   are computed from context at runtime.
───────────────────────────────────────────── */

export const STATIC_REWARDS = {
  pointsPerHour: 10,
  goalForFreeHour: 65,
  perks: [
    "Points credited instantly to your wallet on checkout",
    "Points never expire and stack across sessions",
    "Reach 65 points to redeem a 100% free gaming hour",
  ],
} as const;

/* ─────────────────────────────────────────────
   Static Payment Briefing (fully static, never changes)
───────────────────────────────────────────── */

export const STATIC_PAYMENT_BRIEFING: RazorpayBriefing = {
  provider: "Razorpay",
  encryption: "256-bit SSL Protected",
  supportedMethods: [
    {
      category: "Instant UPI",
      description: "Google Pay, PhonePe, Paytm, CRED & BHIM",
    },
    {
      category: "Cards & EMI",
      description: "All major Debit & Credit cards (Visa, Mastercard, RuPay)",
    },
    {
      category: "NetBanking & Wallets",
      description: "50+ Supported Indian Banks & Digital Wallets",
    },
  ],
  guarantees: [
    "Instant Station Lock: Your rigs are reserved exclusively; walk-ins cannot claim them",
    "Immediate digital booking pass sent via WhatsApp and Email",
    "Snacks delivered hot directly to your rigs during play",
  ],
};
