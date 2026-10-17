"use client";
import React, { useState } from "react";
import type { gameCardProps } from "@/types/gameTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface GameCardComponentProps extends Partial<gameCardProps> {
  game?: gameCardProps;
  id?: string;
  gameId?: string;
  checked?: boolean;
  onCheck?: (id: string, checked?: boolean) => void;
}

const GameCard = (props: GameCardComponentProps, legacyGameId?: string) => {
  const [flipped, setflipped] = useState(false);
  const [internalChecked, setInternalChecked] = useState(false);

  const game = props.game ?? props;
  const isChecked =
    props.checked !== undefined ? props.checked : internalChecked;
  const cardId =
    props.id ??
    props.gameId ??
    game?.id ??
    (typeof legacyGameId === "string" ? legacyGameId : "");

  const handleCardClick = () => {
    const nextChecked = !isChecked;
    if (props.checked === undefined) {
      setInternalChecked(nextChecked);
    }
    props.onCheck?.(cardId, nextChecked);
  };

  return (
    <motion.section
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 20,
      }}
      onClick={handleCardClick}
      className="relative w-42 h-80 md:w-90 md:h-145 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 text-white select-none"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Poster"
          src={game?.imageUrl ?? "/game-card-placeholder.webp"}
          fill
          className="object-cover md:blur-xs"
        />
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
      </div>

      <Checkbox
        checked={isChecked}
        className="absolute md:w-7 md:h-7 right-3 top-3 z-40 pointer-events-none"
      />

      {/* Top content section */}
      <div className="relative z-30">
        <h3 className="font-heading tracking-wide text-lg md:text-3xl line-clamp-3 font-medium text-center text-[18px]">
          {game.name}
        </h3>
        <AnimatePresence mode="wait" initial={false}>
          {!flipped ? (
            <motion.div
              key="game-details"
              initial={{ opacity: 0, scale: 0.9, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -5 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center justify-center"
            >
              {/* Genre Pills */}
              <div className="mt-2 flex w-fit items-center gap-2.5 text-center lowercase text-white/70">
                {game?.genre?.map((g) => (
                  <span
                    key={g}
                    className="rounded-2xl border border-white/40 bg-black/5 px-2 py-0.5 text-[10px] md:text-[17px]"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Rating and release year */}
              <div className="mt-5 flex items-center justify-center gap-2.5 md:gap-5">
                <div className="flex items-center justify-center gap-1">
                  <Star
                    size={20}
                    fill="#FFDF20"
                    className="hidden text-yellow-400 md:block"
                  />
                  <Star
                    size={14}
                    fill="#FFDF20"
                    className="text-yellow-400 md:hidden"
                  />
                  <h4 className="text-[15px] md:text-lg">{game.rating}</h4>
                </div>

                <span className="text-xl font-bold text-white/50">|</span>

                <span className="font-sans text-[16px] font-medium tracking-wider text-white/80 md:text-lg">
                  {game.releaseYear}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="platform-details"
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
              className="mt-5 flex max-h-25 flex-wrap items-center justify-center gap-2.5 overflow-y-auto md:max-h-80"
            >
              {props.platforms?.map((platform) => (
                <span
                  key={platform}
                  className="w-fit rounded-xl border border-white/5 bg-white/30 px-2 py-1.5 text-center font-heading text-xs font-semibold text-white md:text-lg"
                >
                  {platform}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="absolute z-50 bottom-5 flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {!flipped && (
            <motion.div
              key="parent-platforms"
              exit={{
                opacity: 0,
                scale: 0.85,
                y: 6,
                transition: {
                  duration: 0.18,
                  ease: "easeIn",
                },
              }}
              className="mx-auto flex max-w-[80%] flex-wrap items-center justify-center gap-1 whitespace-nowrap md:mx-0 md:max-w-none md:flex-nowrap md:gap-3"
            >
              {game.parentPlatforms?.map((platform, index) => (
                <span
                  key={platform}
                  className="font-heading text-[11px] font-medium text-white/60 md:flex md:items-center md:text-sm"
                >
                  {index > 0 && (
                    <>
                      <span className="mr-3 hidden md:inline">|</span>
                      <span className="md:hidden">•</span>
                    </>
                  )}
                  {platform}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {flipped ? (
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setflipped(false);
            }}
            className="text-white/80 uppercase text-[11px] md:text-sm font-semibold font-heading underline underline-offset-8 cursor-pointer"
          >
            See Details
          </button>
        ) : (
          <button
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setflipped(true);
            }}
            className="text-white/80 uppercase text-[11px] md:text-sm font-semibold font-heading underline underline-offset-8 cursor-pointer"
          >
            All Platforms
          </button>
        )}
      </div>
    </motion.section>
  );
};

export default GameCard;
