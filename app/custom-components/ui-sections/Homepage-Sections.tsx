"use client";
import Image from "next/image";
import React, { useState } from "react";
import { TicketCutLine } from "@/components/ui/ticket-cutout";
import {
  Gamepad2,
  GamepadDirectional,
  HatGlasses,
  Joystick,
  Motorbike,
  Swords,
  Ticket,
} from "lucide-react";
import {
  DeviceFilterGrid,
  DeviceFilterItem,
  FrontendDeviceType,
} from "@/app/custom-components/DeviceFilterCard";
import HookCard from "@/app/custom-components/cards/HookCard";
import type { HookCardProps } from "@/app/custom-components/cards/HookCard";
import Link from "next/link";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import PopularCard from "@/app/custom-components/cards/PopularCard";
import type { PopularCardProps } from "@/app/custom-components/cards/PopularCard";
import RewardsSection from "@/app/custom-components/ui-sections/Reward-Sections";
import { Suspense } from "react";
import MembershipSection from "@/app/custom-components/ui-sections/MembershipSection";
import SnacksSection from "@/app/custom-components/ui-sections/SnacksSection";

const Herosection = () => {
  return (
    <section className="w-[95%] dark:shadow-[0px_3px_15px_0px_#1a202c] shadow-[0px_3px_15px_0px_#cbd5e0] relative rounded-xl mx-auto h-135 md:h-180 md:w-[98%] border border-gray-400/50 dark:border-gray-400/25 bg-gray-100 dark:bg-black md:bg-transparent overflow-hidden">
      <div className="h-[62%] relative md:h-full md:z-0">
        <Image
          alt="hero-image"
          src={"/homepage-hero-image.webp"}
          fill
          priority
          className="w-full h-full object-center object-cover rounded-t-lg"
        />
        <div className="absolute bg-black w-full h-full hidden md:block md:opacity-30 z-10 hover:opacity-45 transition-all ease-out duration-200"></div>
      </div>
      <TicketCutLine
        thickness={4}
        orientation="horizontal"
        iconPosition="center"
        dashGap={6}
        iconColour="text-yellow-800"
        iconSize={19}
        width="98%"
        className="mx-auto md:hidden relative"
      />
      <div className="pb-3 relative md:pb-6 md:w-[45%] md:flex md:backdrop-blur-xs flex-col justify-between md:h-[45%] rounded-b-xl md:absolute md:bottom-13 md:left-15 z-40 md:bg-black/55 md:border border-white/20 md:rounded-lg">
        <div className="absolute hidden md:block z-50 top-6 right-8 text-gray-300">
          <Ticket size={70} strokeWidth={1.8} />
        </div>
        <div className="md:pt-8 md:px-5">
          <h1 className="font-heading font-bold md:font-semibold leading-13 tracking-wide text-[26px] md:text-5xl ml-1 px-4 pt-2.5 md:text-white">
            Your Seat Is Waiting
          </h1>
          <h2 className="font-sans w-[96%] text-[15px] md:text-xl md:font-extralight line-clamp-2 md:mt-3.5 md:w-[90%] md:mb-8 mx-auto md:mx-0 text-gray-500 md:text-gray-400/80 px-5 md:px-8">
            Book your PC or console gaming seat, order snacks online, and enjoy
            an epic gaming session with your friends at CTRL Cafe.
          </h2>
        </div>
        <div className="flex justify-between items-center mx-auto md:mx-0 mt-[3%] md:mt-0 px-4 md:px-6">
          <div className="place-content-center pl-3 md:pl-7 text-[15px] md:text-lg text-gray-500 dark:text-gray-300 md:text-gray-200">
            <span className="mr-1.5 font-heading font-bold text-lg md:text-3xl text-black dark:text-white md:text-white">
              14
            </span>
            <span className="md:hidden">
              Seats
              <br />
              &nbsp;Free Now
            </span>
            <span className="hidden md:block">Seats Free Now</span>
          </div>
          <Link href={"/book"}>
            <button className="bg-accent hover:bg-accent/85 dark:hover:bg-accent/85 transition-all hover:scale-105 hover:-translate-y-1.2 ease-out duration-200 dark:bg-accent/95 dark:font-bold md:font-bold text-accent-foreground px-4 py-3 text-[17px] md:text-xl font-medium tracking-wide font-sans rounded-md">
              Reserve a Seat
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const HookSection = () => {
  const ArenaDetails: Record<FrontendDeviceType, HookCardProps> = {
    CONSOLE: {
      accentText: "PLAY TOGETHER",
      title: "Console",
      description: "Grab a controller. Bring the rivalry.",
      tabs: ["PS5", "Xbox", "Co-op", "Sports"],
      bookingStyleText: "Per Hour",
      deviceType: "CONSOLE",
      buttonHref: "/book/CONSOLE",
      rate: "₹50",
    },

    PC: {
      accentText: "BUILT TO COMPETE",
      title: "PC Gaming",
      description: "Lock in, take aim, and own the leaderboard.",
      tabs: ["FPS", "Racing", "Esports", "RPGs"],
      bookingStyleText: "Per Hour",
      deviceType: "PC",
      buttonHref: "/book/PC",
      rate: "₹59",
    },

    ARCADE: {
      accentText: "ONE MORE ROUND",
      title: "Arcade",
      description: "Chase high scores. Challenge your crew. Run it back.",
      tabs: ["Racing", "Fighters", "Rhythm", "Classics"],
      bookingStyleText: "Per Hour/Day",
      deviceType: "ARCADE",
      buttonHref: "/book/ARCADE",
      rate: "₹89",
    },

    VR: {
      accentText: "REALITY: OPTIONAL",
      title: "VR",
      description: "Don't just play the game. Step inside it.",
      tabs: ["Action", "Rhythm", "Adventure", "Sports"],
      bookingStyleText: "Per Hour",
      deviceType: "VR",
      buttonHref: "/book/VR",
      rate: "₹69",
    },
  };

  const [selected, setselected] = useState<FrontendDeviceType>("CONSOLE");

  const DeviceFilterData: DeviceFilterItem[] = [
    { label: "Console", subLabel: "Big-screen battles", type: "CONSOLE" },
    { label: "PC", subLabel: "High FPS • Precision", type: "PC" },
    { label: "Arcade", subLabel: "Beat the high score", type: "ARCADE" },
    { label: "VR", subLabel: "Enter another world", type: "VR" },
  ];

  return (
    <section className="w-full px-2 mt-5 md:mt-15 relative">
      <div className="hidden absolute top-[8%] z-80 right-[8%] md:flex items-center justify-center gap-15">
        <Joystick size={70} className="text-red-800" />
        <Gamepad2 size={90} className="rotate-20" strokeWidth={1.5} />
      </div>
      <DeviceFilterGrid
        devices={DeviceFilterData}
        onSelectedDevice={setselected}
        selectedDevice={selected}
      />
      <div className="absolute hidden md:block w-[14%] place-items-center place-content-center h-[60%] right-3 bottom-5 z-50 text-blue-900 dark:text-red-300 border bg-gray-400/6 border-gray-300/70 dark:bg-gray-900/6 dark:border-gray-900 rounded-lg">
        {/* <Image
          alt="Ready?"
          src={`/${ArenaDetails[selected].deviceType.toLowerCase()}-cutout.webp`}
          fill
          className="object-contain rounded-lg"
        /> */}
        {selected === "PC" && <Swords size={120} strokeWidth={1.3} />}
        {selected === "CONSOLE" && (
          <GamepadDirectional size={120} strokeWidth={1.3} />
        )}
        {selected === "VR" && <HatGlasses size={120} strokeWidth={1.3} />}
        {selected === "ARCADE" && <Motorbike size={120} strokeWidth={1.3} />}
      </div>
      {selected && (
        <div className="mt-1 md:mt-3 md:pl-3 md:w-[80%] md:ml-[5%]">
          <HookCard {...ArenaDetails[selected]} />
        </div>
      )}
    </section>
  );
};

const POPULAR_MEDIA_QUERY = "(min-width: 768px)";

function subscribeToMediaQuery(callback: () => void) {
  const mq = window.matchMedia(POPULAR_MEDIA_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getItemDistance() {
  return window.matchMedia(POPULAR_MEDIA_QUERY).matches ? 90 : 50;
}

function getServerItemDistance() {
  return 50;
}

// Popular Section
const PopularSection = () => {
  const itemDistance = React.useSyncExternalStore(
    subscribeToMediaQuery,
    getItemDistance,
    getServerItemDistance,
  );

  const data: PopularCardProps[] = [
    {
      deviceName: "CONSOLE",
      arenaName: "Console Zone",
      imageUrl: "/console-zone.webp",
      ratePerHour: 50,
      description:
        "Grab a controller and challenge your crew on the big screen — PS5 titles, co-op battles, and sports showdowns await.",
      index: 0,
    },
    {
      deviceName: "PC",
      arenaName: "PC Habitat",
      imageUrl: "/pc-zone.webp",
      ratePerHour: 59,
      description:
        "High-FPS rigs built for precision. Lock in, take aim, and own the leaderboard on our esports-grade setups.",
      index: 1,
    },
    {
      deviceName: "Arcade",
      arenaName: "Arcade Bay",
      imageUrl: "/arcade-zone.webp",
      ratePerHour: 89,
      description:
        "Chase high scores and challenge your crew on classic cabinets and modern rhythm machines.",
      index: 2,
    },
  ];

  return (
    <section className="w-full mt-10 md:mt-20">
      {/* Header */}
      <div className="px-3 md:px-10 mb-0 md:mb-2">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-yellow-700 dark:text-yellow-500 mb-1.5">
          Pick your next session
        </p>
        <h2 className="font-heading font-bold text-4xl md:text-6xl text-zinc-900 dark:text-zinc-100 leading-tight">
          Popular right now
          <span className="text-accent">.</span>
        </h2>
      </div>

      {/* ScrollStack wrapper — needs a fixed height to scroll inside */}
      <div className="h-120 md:h-150 w-full md:w-[99%] md:px-15 md:mx-auto rounded-xl overflow-hidden">
        <ScrollStack
          itemDistance={itemDistance}
          itemStackDistance={18}
          stackPosition="8%"
          itemScale={0.02}
          baseScale={0.9}
          dimAmount={0.18}
          smoothScroll
          snap
          blurAmount={2}
          className="scrollbar-none"
        >
          {data.map((card, i) => (
            <ScrollStackItem
              key={card.arenaName}
              itemClassName="!rounded-lg !h-100 md:!h-120 !p-0 !bg-transparent overflow-hidden"
            >
              <PopularCard {...card} index={i} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
};

const RewardsHomepageSection = ({
  points,
  onClaim,
}: {
  points?: number | null;
  onClaim?: () => void | Promise<void>;
}) => {
  return (
    <section className="flex w-full flex-col xl:flex-row xl:items-center xl:justify-between xl:px-6">
      <div className="w-full xl:w-[60%]">
        <RewardsSection points={points} onClaim={onClaim} />
      </div>

      <div className="mx-auto flex w-full max-w-260 flex-col gap-8 px-5 pb-12 md:grid md:grid-cols-2 md:px-6 xl:flex xl:w-[30%] xl:max-w-none xl:px-0 xl:pb-0">
        <MembershipSection />
        <SnacksSection />
      </div>
    </section>
  );
};

export { Herosection, HookSection, PopularSection, RewardsHomepageSection };
