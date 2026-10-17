"use client";
import React, { useState } from "react";
import type { deviceCardType } from "@/types/deviceTypes";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

const DeviceCard = ({
  deviceDetails,
  onClick,
}: {
  deviceDetails: deviceCardType;
  onClick: (isSelected: boolean, id: string) => void;
}) => {
  const [selected, setselected] = useState(false);

  const handleCardClick = () => {
    const nextSelected = !selected;
    setselected(nextSelected);
    onClick(nextSelected, deviceDetails.id);
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 20,
      }}
      onClick={handleCardClick}
      className="flex group/deviceCard shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_10px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-99 transition-all ease-out duration-200 items-center flex-col rounded-2xl relative bg-black/90 dark:bg-white/90 px-2.5 pb-0 h-70 md:h-110 w-full mx-2 md:mx-0 md:w-130"
    >
      <div
        className={`absolute inset-0 z-10 transition-colors ease-out duration-200 ${
          selected ? "bg-black/60 dark:bg-black/30" : "group-hover/deviceCard:bg-black/20"
        }`}
      >
        <AnimatePresence>
          {selected && (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 22,
              }}
              className="absolute inset-0 grid place-items-center pointer-events-none"
            >
              <Check width="50%" height="50%" color="#feffd2" strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative w-full flex-8 min-h-0 bg-white/7 dark:bg-black/7 rounded-2xl mt-2.5">
        <Image
          alt="Device Image"
          src={deviceDetails?.imageUrl ?? "/new-device-cutout.webp"}
          fill
          sizes="100vw"
          className="object-cover object-top"
          draggable={false}
        />
      </div>
      <div className="relative z-20 flex items-center justify-center gap-3 w-[70%] text-white/90 dark:text-black/80 flex-[1.5] h-fit">
        <h5 className="text-center font-heading font-semibold tracking-wider text-2xl md:text-4xl h-fit line-clamp-1">
          {deviceDetails?.name}
        </h5>
        {!deviceDetails?.isNewDevice && <p>- {deviceDetails.units}</p>}
      </div>
    </motion.button>
  );
};

export default DeviceCard;
