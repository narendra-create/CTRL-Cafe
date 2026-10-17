"use client";
import React from "react";
import GameCard from "@/app/custom-components/cards/gameCard";
import { gameCardProps } from "@/types/gameTypes";
import DeviceCard from "@/app/custom-components/cards/deviceCard";
import type { deviceCardType } from "@/types/deviceTypes";

const testpage = () => {
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
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-50">
      <GameCard {...data} />
      <GameCard {...data} />
      {/* <DeviceCard {...deviceData} /> */}
    </div>
  );
};

export default testpage;
