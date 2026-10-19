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

const DeviceFilterCard = ({
  device,
  isSelected,
  onClick,
}: DeviceFilterCardProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      onClick={() => onClick(device.type)}
      className={`
        flex flex-col items-start justify-center gap-0.5 cursor-pointer select-none
        rounded-xl px-4 py-4 md:py-6 w-full transition-all ease-out duration-200
        ${
          isSelected
            ? "dark:bg-accent/85 bg-foreground text-background shadow-md"
            : "bg-muted/60 dark:bg-gray-600/5 text-muted-foreground hover:bg-muted dark:hover:bg-muted/60"
        }
      `}
    >
      <span
        className={`font-heading pl-2 font-semibold tracking-wide text-lg md:text-2xl leading-tight transition-colors duration-200 ${
          isSelected
            ? "text-gray-100 dark:text-gray-900"
            : "text-foreground/70 dark:text-gray-200"
        }`}
      >
        {device.label}
      </span>
      <span
        className={`font-sans text-[10px] text-start pl-2.5 md:text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${
          isSelected
            ? "text-gray-400 dark:text-gray-700"
            : "text-gray-500/80 dark:text-gray-600"
        }`}
      >
        {device.subLabel}
      </span>
    </motion.button>
  );
};

// --- Filter Grid Parent ---

const DeviceFilterGrid = ({
  devices,
  selectedDevice,
  onSelectedDevice,
}: DeviceFilterGridProps) => {
  return (
    <div className="w-full flex flex-col gap-3 md:mx-15">
      <p className="font-heading md:mb-5 text-sm md:text-xl font-bold text-black dark:text-white uppercase tracking-[0.2em] pl-0.5">
        Choose Your Arena
      </p>
      <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-row md:min-h-25 md:max-w-[70vw] md:w-full md:ml-9 md:gap-2.5 border border-gray-300 dark:border-gray-800 rounded-2xl p-1">
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
