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
  id: string;
  name: string;
  qty: number;
  serves: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface RewardsSummary {
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

export const mockBookingReview: BookingReviewData = {
  schedule: {
    dateFormatted: "Mon, 2 Nov 2026",
    isoDate: "2026-11-02",
    startsAt: "4:00 PM",
    endsAt: "6:00 PM",
    durationFormatted: "2 hours",
    durationHours: 2,
    totalPlayers: 10,
    arrivalWindow: "Check-in at front desk 5 mins prior (3:55 PM)",
  },
  deviceSetups: [
    {
      id: "ps5-squad",
      deviceType: "CONSOLE",
      title: "PlayStation 5 Squad Pods",
      count: 3,
      image: "/console-cutout.webp",
      tagline: "Big-screen co-op & rivalry setups",
      features: [
        "4K 120Hz Low-Latency Gaming Screens",
        "DualSense Wireless Haptic Controllers",
        "Pre-installed: FC 25, Mortal Kombat 1, Tekken 8, Spider-Man 2",
      ],
      stations: [
        {
          id: "ps5-st-1",
          name: "Station 1",
          stationNumber: 1,
          players: 3,
          maxPlayers: 4,
        },
        {
          id: "ps5-st-2",
          name: "Station 2",
          stationNumber: 2,
          players: 2,
          maxPlayers: 4,
        },
        {
          id: "ps5-st-3",
          name: "Station 3",
          stationNumber: 3,
          players: 4,
          maxPlayers: 4,
        },
      ],
    },
    {
      id: "pc-battlestation",
      deviceType: "PC",
      title: "Gaming PC Battlestation",
      count: 1,
      image: "/pc-cutout.webp",
      tagline: "High-FPS precision esports rig",
      features: [
        "RTX 4060 GPU · 240Hz Fast IPS Display",
        "Mechanical Linear Switch Keyboard & Ultralight Mouse",
        "Pre-tuned Discord, Steam, Valorant, CS2 & GTA V",
      ],
      stations: [
        {
          id: "pc-st-1",
          name: "Station 1",
          stationNumber: 1,
          players: 1,
          maxPlayers: 1,
        },
      ],
    },
  ],
  snacks: [
    {
      id: "snack-1",
      name: "Momos",
      qty: 2,
      serves: "Serves 1 each",
      category: "Steamed Dumplings",
      imageUrl: "https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg",
      description: "Steamed fresh with house spicy red chutney",
    },
    {
      id: "snack-2",
      name: "Cheese Burger",
      qty: 1,
      serves: "Serves 1",
      category: "Signature Burger",
      imageUrl: "https://images.pexels.com/photos/32480062/pexels-photo-32480062.jpeg",
      description: "Grilled brioche bun with melted cheddar",
    },
    {
      id: "snack-3",
      name: "Fried Rice",
      qty: 1,
      serves: "Serves 2",
      category: "Wok Specials",
      imageUrl: "https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg",
      description: "Wok-tossed hot with vegetables and herbs",
    },
  ],
  rewards: {
    pointsPerHour: 10,
    hoursBooked: 2,
    totalPointsEarned: 20,
    goalForFreeHour: 65,
    pointsRemainingForFreeHour: 45,
    perks: [
      "+20 CTRL Points credited instantly on checkout",
      "Points never expire and stack across sessions",
      "Reach 65 points to redeem a 100% free gaming hour",
    ],
  },
  paymentBriefing: {
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
  },
};
