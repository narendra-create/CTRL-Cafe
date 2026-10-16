"use client"
import React from "react";
import GameCard from "@/app/custom-components/cards/gameCard";
import { gameCardProps } from "@/types/gameTypes";

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
  return (
    <div className="flex items-center justify-center mt-50">
      <GameCard {...data} />
    </div>
  );
};

export default testpage;
