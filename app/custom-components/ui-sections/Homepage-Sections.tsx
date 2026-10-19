"use client";
import Image from "next/image";
import React, { useState } from "react";
import { TicketCutLine } from "@/components/ui/ticket-cutout";
import { Gamepad2, Joystick, Ticket } from "lucide-react";
import {
  DeviceFilterGrid,
  DeviceFilterItem,
  FrontendDeviceType,
} from "@/app/custom-components/DeviceFilterCard";
import HookCard from "@/app/custom-components/cards/HookCard";
import type { HookCardProps } from "@/app/custom-components/cards/HookCard";

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
          <button className="bg-accent hover:bg-accent/85 dark:hover:bg-accent/85 transition-all hover:scale-105 hover:-translate-y-1.2 ease-out duration-200 dark:bg-accent/95 dark:font-bold md:font-bold text-accent-foreground px-4 py-3 text-[17px] md:text-xl font-medium tracking-wide font-sans rounded-md">
            Reserve a Seat
          </button>
        </div>
      </div>
    </section>
  );
};

const HookSection = () => {
  type ArenaDescriptions = Record<FrontendDeviceType, HookCardProps>;
  const ArenaDetails: Record<FrontendDeviceType, HookCardProps> = {
    CONSOLE: {
      accentText: "PLAY TOGETHER",
      title: "Console",
      description: "Grab a controller. Bring the rivalry.",
      tabs: ["PS5", "Xbox", "Co-op", "Sports"],
      bookingStyleText: "Your next rematch starts here.",
      deviceType: "CONSOLE",
      buttonHref: "/book/console",
      rate: "₹50",
    },

    PC: {
      accentText: "BUILT TO COMPETE",
      title: "PC Gaming",
      description: "Lock in, take aim, and own the leaderboard.",
      tabs: ["FPS", "Racing", "Esports", "RPGs"],
      bookingStyleText: "Ready to clutch the win?",
      deviceType: "PC",
      buttonHref: "/book/pc",
      rate: "₹59",
    },

    ARCADE: {
      accentText: "ONE MORE ROUND",
      title: "Arcade",
      description: "Chase high scores. Challenge your crew. Run it back.",
      tabs: ["Racing", "Fighters", "Rhythm", "Classics"],
      bookingStyleText: "Think you can beat the high score?",
      deviceType: "ARCADE",
      buttonHref: "/book/arcade",
      rate: "₹89",
    },

    VR: {
      accentText: "REALITY: OPTIONAL",
      title: "VR",
      description: "Don't just play the game. Step inside it.",
      tabs: ["Action", "Rhythm", "Adventure", "Sports"],
      bookingStyleText: "Step into your next adventure.",
      deviceType: "VR",
      buttonHref: "/book/vr",
      rate: "₹69",
    },
  };

  const [selected, setselected] = useState<FrontendDeviceType | null>(
    "CONSOLE",
  );

  const DeviceFilterData: DeviceFilterItem[] = [
    { label: "Console", subLabel: "Big-screen battles", type: "CONSOLE" },
    { label: "PC", subLabel: "High FPS • Precision", type: "PC" },
    { label: "Arcade", subLabel: "Beat the high score", type: "ARCADE" },
    { label: "VR", subLabel: "Enter another world", type: "VR" },
  ];

  return (
    <section className="w-full px-2 mt-5 md:mt-15 relative">
      <div className="hidden absolute top-[8%] z-80 right-[8%] md:flex items-center justify-center gap-8">
        <Joystick size={70} className="text-red-800"/>
        <Gamepad2 size={90} className="rotate-20" strokeWidth={1.5}/>
      </div>
      <DeviceFilterGrid
        devices={DeviceFilterData}
        onSelectedDevice={setselected}
        selectedDevice={selected}
      />
      {selected && (
        <div className="mt-1 md:mt-3 md:pl-3 md:w-[91%] md:mx-auto">
          <HookCard {...ArenaDetails[selected]} />
        </div>
      )}
    </section>
  );
};

export { Herosection, HookSection };
