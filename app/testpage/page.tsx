"use client";
import React, { useState } from "react";
import GameCard from "@/app/custom-components/cards/gameCard";
import { gameCardProps } from "@/types/gameTypes";
import DeviceCard from "@/app/custom-components/cards/deviceCard";
import type { deviceCardType } from "@/types/deviceTypes";
import {
  DeviceFilterGrid,
  DeviceFilterItem,
  FrontendDeviceType,
} from "@/app/custom-components/DeviceFilterCard";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { PopularSection } from "@/app/custom-components/ui-sections/Homepage-Sections";

const testpage = () => {
  const [selected, setselected] = useState<FrontendDeviceType | null>(null);
  const data: gameCardProps = {
    name: "Grand Theft Auto V",
    imageUrl:
      "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
    genre: ["Action", "Crime"],
    rating: 4.47,
    releaseYear: 2013,
    parentPlatforms: ["PC", "PlayStation", "Xbox"],
    platforms: [
      "PlayStation 5",
      "Xbox Series S/X",
      "PlayStation 3",
      "PC",
      "PlayStation 4",
      "Xbox 360",
      "Xbox One",
    ],
  };
  const deviceData: deviceCardType = {
    imageUrl: "/console-cutout.webp",
    isNewDevice: true,
    name: "PlayStation 5",
    id: "1",
    units: 5,
  };
  const devices: DeviceFilterItem[] = [
    { label: "Console", subLabel: "High end", type: "CONSOLE" },
    { label: "PC", subLabel: "High end", type: "PC" },
    { label: "Arcade", subLabel: "High end", type: "ARCADE" },
    { label: "VR", subLabel: "High end", type: "VR" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mt-50 px-2">
      {/* <GameCard {...data} />
      <GameCard {...data} />
      <DeviceCard
        deviceDetails={deviceData}
        onClick={(isSelected, id) => console.log("id", id, "value", isSelected)}
      /> */}
      {/* <DeviceFilterGrid
        devices={devices}
        onSelectedDevice={setselected}
        selectedDevice={selected}
      /> */}
      <div className="pb-55 w-full">
        <PopularSection />
      </div>
    </div>
  );
};

export default testpage;
