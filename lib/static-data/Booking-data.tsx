import type { Arena } from "@/types/bookingTypes";

/* Section: Static Data */
export const ARENAS: Arena[] = [
  {
    key: "CONSOLE",
    label: "Console",
    subLabel: "Big-screen battles",
    eyebrow: "PLAY TOGETHER",
    description: "Grab a controller. Bring the rivalry.",
    tags: ["PS5", "Xbox", "Co-op", "Sports"],
    price: 50,
    totalUnits: 5,
    maxPlayers: 4,
  },
  {
    key: "PC",
    label: "PC",
    subLabel: "High FPS · Precision",
    eyebrow: "PLAY TO WIN",
    description: "High refresh monitors and fast rigs.",
    tags: ["Valorant", "CS2", "GTA V"],
    price: 80,
    totalUnits: 6,
    maxPlayers: 2,
  },
  {
    key: "ARCADE",
    label: "Arcade",
    subLabel: "Beat the high score",
    eyebrow: "PLAY TOGETHER",
    description: "Classic cabinets, new rivalries.",
    tags: ["Racing", "Fighting"],
    price: 60,
    totalUnits: 2,
    maxPlayers: 2,
  },
  {
    key: "VR",
    label: "VR",
    subLabel: "Enter another world",
    eyebrow: "PLAY IMMERSIVE",
    description: "Full-room VR. One headset per device.",
    tags: ["Beat Saber", "Horror", "Sim"],
    price: 150,
    totalUnits: 1,
    maxPlayers: 2,
  },
];