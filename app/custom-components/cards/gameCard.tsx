"use client";
import React, { useState } from "react";
import type { gameCardProps } from "@/types/gameTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import Image from "next/image";

const GameCard = (game: gameCardProps) => {
  const [flipped, setflipped] = useState(false);

  return (
    <section className="relative w-90 h-145 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Poster"
          src={game?.imageUrl ?? "/game-card-placeholder.webp"}
          fill
          className="object-cover blur-xs"
        />
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
      </div>

      <Checkbox className="absolute right-3 top-3 z-40" />

      {/* Top content section */}
      <div className="relative z-30">
        <h3 className="font-heading tracking-wide text-3xl line-clamp-3 font-medium">{game.name}</h3>
        <div className="flex flex-col items-center justify-center">
          {/* Genre Pills */}
          <div className="mt-2 text-center w-fit lowercase text-white/70 gap-2.5 flex items-center">
            {game?.genre && game.genre.map((g) => <span className="border border-white/40 bg-black/5 px-2 text-[10px] md:text-[17px] rounded-2xl py-0.5" key={g}>{g}</span>)}
          </div>
          {/* Ratings and releaseYear section */}
          <div className="flex justify-center items-center gap-5 mt-5">
            <div className="flex items-center justify-center gap-1">
              <Star size={20} fill="#FFDF20" className="text-yellow-400"/>
              <h4 className="text-lg">{game.rating}</h4>
            </div>
            <span className="font-bold text-white/50 text-xl">|</span>
            <span className="text-white/80 font-sans tracking-wider font-medium text-lg">{game.releaseYear}</span>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="absolute z-50 bottom-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {game?.parentPlatforms &&
            game.parentPlatforms.map((platform, index) => (
              <span
                key={platform}
                className="font-heading font-medium text-sm text-white/60"
              >
                {index > 0 && <span className="mr-3"> | </span>}
                {platform}
              </span>
            ))}
        </div>
        {flipped ? (
          <button onClick={() => setflipped(false)} className="text-white/80 uppercase md:text-sm font-semibold font-heading underline underline-offset-8">See Details</button>
        ) : (
          <button onClick={() => setflipped(true)} className="text-white/80 uppercase md:text-sm font-semibold font-heading underline underline-offset-8">View All Platforms</button>
        )}
      </div>
    </section>
  );
};

export default GameCard;
