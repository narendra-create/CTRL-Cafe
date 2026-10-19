"use client";
import React from "react";
import { motion } from "motion/react";

// --- Types ---

export type FrontendDeviceType = "CONSOLE" | "PC" | "ARCADE" | "VR";

export interface DeviceFilterItem {
  type: FrontendDeviceType;
  label: string;
  subLabel: string;
}

interface DeviceFilterCardProps {
  device: DeviceFilterItem;
  isSelected: boolean;
  onClick: (type: FrontendDeviceType) => void;
}

interface DeviceFilterGridProps {
  devices: DeviceFilterItem[];
  selectedDevice: FrontendDeviceType | null;
  onSelectedDevice: (type: FrontendDeviceType) => void;
}

// --- Single Filter Card ---

const DeviceFilterCard = ({ device, isSelected, onClick }: DeviceFilterCardProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      onClick={() => onClick(device.type)}
      className={`
        flex flex-col items-start justify-center gap-0.5 cursor-pointer select-none
        rounded-xl px-4 py-3 w-full transition-all ease-out duration-200
        ${
          isSelected
            ? "bg-foreground text-background shadow-md"
            : "bg-muted/60 dark:bg-muted/40 text-muted-foreground hover:bg-muted dark:hover:bg-muted/60"
        }
      `}
    >
      <span
        className={`font-heading font-semibold tracking-wide text-base md:text-lg leading-tight transition-colors duration-200 ${
          isSelected ? "text-background" : "text-foreground/70"
        }`}
      >
        {device.label}
      </span>
      <span
        className={`font-sans text-[11px] md:text-xs uppercase tracking-widest transition-colors duration-200 ${
          isSelected ? "text-background/60" : "text-muted-foreground/70"
        }`}
      >
        {device.subLabel}
      </span>
    </motion.button>
  );
};

// --- Filter Grid Parent ---

const DeviceFilterGrid = ({ devices, selectedDevice, onSelectedDevice }: DeviceFilterGridProps) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <p className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground pl-0.5">
        Choose Your Arena
      </p>
      <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-row md:gap-2.5">
        {devices.map((device) => (
          <DeviceFilterCard
            key={device.type}
            device={device}
            isSelected={selectedDevice === device.type}
            onClick={onSelectedDevice}
          />
        ))}
      </div>
    </div>
  );
};

export { DeviceFilterCard, DeviceFilterGrid };
