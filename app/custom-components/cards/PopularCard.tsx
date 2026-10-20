"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export interface PopularCardProps {
  deviceName: string;
  arenaName: string;
  imageUrl: string;
  ratePerHour: number;
  description: string;
  index?: number;
}

const PopularCard = ({
  deviceName,
  arenaName,
  imageUrl,
  ratePerHour,
  description,
  index = 0,
}: PopularCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.07 }}
      className="relative hover:scale-101 ease-out duration-200 transition-all w-full h-full rounded-lg overflow-hidden select-none group/popuparcard"
    >
      <Link href={`/book/${deviceName.toUpperCase()}`}>
        <div className="absolute z-50 top-3 right-3 md:right-7 md:top-7 group-hover/popuparcard:-translate-y-1.5 group-hover/popuparcard:translate-x-1.5 transition-transform ease-out duration-200 text-gray-400">
          <ExternalLink className="md:hidden" />
          <ExternalLink className="hidden md:block" size={40} />
        </div>

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            alt={arenaName}
            src={imageUrl}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            draggable={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between h-full p-4 md:p-8">
          {/* Top — index + device label */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-accent font-bold text-sm md:text-3xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-white/50 font-mono font-bold text-sm md:text-2xl">
              /
            </span>
            <span className="font-mono text-white/80 uppercase font-semibold tracking-widest text-xs md:text-lg">
              {deviceName}
            </span>
          </div>

          {/* Bottom — arena name, rate, description */}
          <div className="flex flex-col gap-1.5  md:mb-10">
            <div className="flex items-end justify-between gap-3">
              <h3 className="font-heading font-bold text-white text-xl md:text-5xl md:pl-7 leading-tight">
                {arenaName}
              </h3>
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="font-heading font-bold text-accent text-2xl md:text-3xl line-through decoration-white/30">
                  ₹{ratePerHour}
                </span>
                <span className="font-mono text-white/60 text-xs md:text-lg uppercase tracking-wider">
                  /hr
                </span>
              </div>
            </div>
            <p className="font-sans pl-0.5 md:pl-10 text-white/55 text-sm md:text-base leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default PopularCard;
