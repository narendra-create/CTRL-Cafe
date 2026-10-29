"use client";
import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { DatePickerSimple } from "@/components/Date-Picker";
import {
  createTimeSlots,
  getOperatingHours,
  minutesToTime,
} from "@/lib/utils/tools";
import { TimePicker } from "@/components/ui/time-picker";
import { Arena, DeviceType } from "@/types/bookingTypes";
import { useBooking } from "@/app/book/Book-page-contaxt";
import { ARENAS } from "@/lib/static-data/Booking-data";

const BOOKED: Record<DeviceType, number[]> = {
  CONSOLE: [2],
  PC: [1, 4],
  ARCADE: [],
  VR: [],
};

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/* Section: Sub-components */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] md:text-xl font-extrabold tracking-wide text-foreground uppercase">
      {children}
    </p>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase"
    >
      {children}
    </label>
  );
}

/* Section: Arena Tab */
function ArenaTab({
  arena,
  isSelected,
  onClick,
}: {
  arena: Arena;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-[13px] px-3 md:px-4 py-3 md:py-4 text-left cursor-pointer transition-all duration-150 ${
        isSelected
          ? "bg-accent text-accent-foreground shadow-[0_6px_20px_rgba(250,204,21,0.2)]"
          : "bg-transparent text-background hover:bg-background/15"
      }`}
    >
      <span className="block text-[15px] md:text-[22px] font-bold leading-wide">
        {arena.label}
      </span>
      <span
        className={`block text-[10px] md:text-xs tracking-[0.11em] uppercase font-semibold ${
          isSelected ? "text-accent-foreground/60" : "text-background/50"
        }`}
      >
        {arena.subLabel}
      </span>
    </button>
  );
}

/* Section: Arena Info Card */

function ArenaInfoCard({ arena }: { arena: Arena }) {
  const freeUnits = arena.totalUnits - BOOKED[arena.key].length;

  return (
    <div className="mt-2.5 shadow-[0px_4px_20px_0px_#00000024] dark:shadow-[0px_4px_5px_0px_#1a202c] bg-card dark:bg-background border border-foreground/15 dark:border-border rounded-2xl px-5 py-4 flex justify-between gap-4 items-start">
      <div>
        <p className="text-[10px] md:text-[14px] font-bold tracking-widest text-yellow-600 dark:text-accent uppercase mb-1">
          {arena.eyebrow}
        </p>
        <h3 className="text-[22px] md:text-3xl font-bold mb-1">
          {arena.label}
        </h3>
        <p className="text-[13px] md:text-sm text-foreground/60 dark:text-muted-foreground">
          {arena.description}
        </p>
        <div className="flex gap-2 flex-wrap mt-3">
          {arena.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] md:text-[14px] font-medium border border-black/30 bg-black/2 dark:bg-none dark:border-border rounded-md px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[26px] md:text-3xl font-bold leading-none text-yellow-600 dark:text-accent">
          ₹{arena.price}
        </p>
        <p className="text-[10px] md:text-[12px] tracking-[0.11em] text-muted-foreground font-semibold mt-1.5">
          /Hour per device
        </p>
        <p className="text-[11px] text-muted-foreground mt-2">
          {freeUnits} of {arena.totalUnits} free
        </p>
      </div>
    </div>
  );
}

/* Section: Device Card */

function DeviceCard({
  arena,
  deviceNumber,
  isBooked,
  players,
  onToggle,
  onAdjust,
}: {
  arena: Arena;
  deviceNumber: number;
  isBooked: boolean;
  players: number;
  onToggle: () => void;
  onAdjust: (delta: number) => void;
}) {
  const isSelected = players > 0;

  return (
    <div
      role={isBooked ? undefined : "button"}
      tabIndex={isBooked ? undefined : 0}
      onClick={isBooked ? undefined : onToggle}
      onKeyDown={
        isBooked
          ? undefined
          : (e) => (e.key === "Enter" || e.key === " " ? onToggle() : undefined)
      }
      className={`rounded-2xl border p-1.5 md:p-3.5 transition-all duration-150 select-none ${
        isBooked
          ? "opacity-40 cursor-not-allowed border-black/30 dark:border-border bg-background"
          : isSelected
            ? "border-accent bg-accent/5 dark:bg-accent/[0.07] shadow-[0px_4px_20px_0px_#cbd5e0] dark:shadow-[0px_4px_20px_0px_#1a202c] cursor-pointer"
            : "border-border dark:bg-background cursor-pointer shadow-[0px_4px_20px_0px_#cbd5e0] dark:shadow-[0px_4px_20px_0px_#1a202c] hover:border-yellow-600 hover:dark:border-accent/40"
      }`}
    >
      {/* Icon */}
      <div className="mb-2.5">
        <svg
          viewBox="0 0 24 24"
          className={`w-8 h-8 md:w-12 md:h-12 fill-none stroke-[1.6] ${
            isSelected
              ? "stroke-yellow-700 dark:stroke-accent"
              : "stroke-foreground dark:stroke-muted-foreground"
          }`}
        >
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      </div>

      <span className="block text-[15px] font-semibold md:text-xl">
        {arena.label} {deviceNumber}
      </span>
      <span className="block text-[12px] md:text-[15px] text-foreground/60 dark:text-muted-foreground mt-0.5">
        {isBooked ? "Booked" : `Up to ${arena.maxPlayers} players`}
      </span>

      {/* Player stepper */}
      {isSelected && !isBooked && (
        <div
          className="mt-2.5 md:max-w-[95%] flex items-center justify-between bg-muted rounded-[10px] px-0.5 md:px-2 py-0.5 md:py-3 border border-black/20 dark:border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Fewer players"
            onClick={() => onAdjust(-1)}
            className="w-7 h-7 rounded-lg bg-accent text-accent-foreground cursor-pointer flex items-center justify-center shrink-0"
          >
            <Minus size={12} strokeWidth={3} />
          </button>
          <span className="text-[12px] text-center md:text-[15px] font-semibold">
            {players} player{players > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            aria-label="More players"
            onClick={() => onAdjust(1)}
            className="w-7 h-7 rounded-lg bg-accent text-accent-foreground cursor-pointer flex items-center justify-center shrink-0"
          >
            <Plus size={12} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}

/* Section: Main Component */
export default function BookingClient({
  initialDevice,
}: {
  initialDevice: DeviceType;
}) {
  const {
    selectedArena,
    setSelectedArena,
    allSelections,
    setAllSelections,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
  } = useBooking();

  useEffect(() => {
    setSelectedArena(initialDevice);
  }, [initialDevice, setSelectedArena]);

  const operatingHours = getOperatingHours(date);
  const startTimeSlots = createTimeSlots(
    operatingHours.open,
    operatingHours.close - 30,
  );

  const endTimeSlots = createTimeSlots(
    toMinutes(startTime) + 30,
    operatingHours.close,
  );

  const arena = ARENAS.find((a) => a.key === selectedArena)!;
  const currentSel = allSelections[selectedArena] ?? {};

  const durationHours = Math.max(
    0,
    (toMinutes(endTime) - toMinutes(startTime)) / 60,
  );

  function handleArenaChange(key: DeviceType) {
    setSelectedArena(key);
  }

  function handleDateChange(nextDate: string) {
    const hours = getOperatingHours(nextDate);
    const currentStart = toMinutes(startTime);

    const nextStart =
      currentStart >= hours.open && currentStart <= hours.close - 30
        ? startTime
        : minutesToTime(hours.open);

    const nextStartMinutes = toMinutes(nextStart);
    const currentEnd = toMinutes(endTime);

    const nextEnd =
      currentEnd > nextStartMinutes && currentEnd <= hours.close
        ? endTime
        : minutesToTime(Math.min(nextStartMinutes + 60, hours.close));

    setDate(nextDate);
    setStartTime(nextStart);
    setEndTime(nextEnd);
  }

  function handleDeviceToggle(deviceIndex: number) {
    setAllSelections((prev) => {
      const sel = { ...(prev[selectedArena] ?? {}) };
      if (sel[deviceIndex]) {
        delete sel[deviceIndex];
      } else {
        sel[deviceIndex] = 1;
      }
      return { ...prev, [selectedArena]: sel };
    });
  }

  function handleAdjust(deviceIndex: number, delta: number) {
    setAllSelections((prev) => {
      const sel = { ...(prev[selectedArena] ?? {}) };
      const current = sel[deviceIndex] ?? 1;
      sel[deviceIndex] = Math.min(
        arena.maxPlayers,
        Math.max(1, current + delta),
      );
      return { ...prev, [selectedArena]: sel };
    });
  }

  const bookedDevices = BOOKED[selectedArena];
  const freeUnits = arena.totalUnits - bookedDevices.length;

  return (
    <section className="flex flex-col gap-8 md:gap-10">
      {/* Section: Header */}
      <div className="mt-6 md:mt-8 mb-4 md:mb-6">
        <h1 className="text-3xl md:text-7xl font-bold tracking-[-0.03em] leading-tight">
          Reserve a device<span className="text-accent">.</span>
        </h1>
        <p className="text-muted-foreground text-xs mx-2.5 md:mx-0 md:text-[15px] mt-2 max-w-[44em] leading-relaxed">
          Pick an arena, choose your devices and set your time. Each device is a
          full unit — bring the whole squad.
        </p>
      </div>

      {/* Section: Arena Selection */}
      <div>
        <SectionLabel>Choose your arena</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 md:max-w-[88%] gap-1.5 bg-foreground dark:bg-foreground/98 border border-border rounded-[18px] p-1.5">
          {ARENAS.map((a) => (
            <ArenaTab
              key={a.key}
              arena={a}
              isSelected={selectedArena === a.key}
              onClick={() => handleArenaChange(a.key)}
            />
          ))}
        </div>
        <ArenaInfoCard arena={arena} />
      </div>

      {/* Section: Device Picker */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <SectionLabel>
            Pick your {arena.label.toLowerCase()} devices
          </SectionLabel>
          <span className="text-[11px] md:text-[12px] text-red-600 dark:text-red-400 font-semibold -mt-3">
            {freeUnits} of {arena.totalUnits} available
          </span>
        </div>

        {/* Scrollable device grid */}
        <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-black/12 dark:border-border bg-foreground/1 dark:bg-muted/20 p-3 scrollbar-thin">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: arena.totalUnits }, (_, i) => {
              const isBooked = bookedDevices.includes(i);
              const players = currentSel[i] ?? 0;
              return (
                <DeviceCard
                  key={`${selectedArena}-${i}`}
                  arena={arena}
                  deviceNumber={i + 1}
                  isBooked={isBooked}
                  players={players}
                  onToggle={() => handleDeviceToggle(i)}
                  onAdjust={(d) => handleAdjust(i, d)}
                />
              );
            })}
          </div>
        </div>
        <p className="text-[12px] text-muted-foreground mt-2.5">
          You book the whole device unit, whatever the player count.
        </p>
      </div>

      {/* Section: Date and Time */}
      <div>
        <SectionLabel>Date and time</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <DatePickerSimple
              selectedDate={date}
              onDateSelect={handleDateChange}
            />
          </div>
          <div>
            <div>
              <FieldLabel htmlFor="book-start">Start time</FieldLabel>

              <TimePicker
                id="book-start"
                ariaLabel="Start time"
                placeholder="Select start time"
                options={startTimeSlots.map((slot) => slot.label)}
                value={
                  startTimeSlots.find((slot) => slot.value === startTime)
                    ?.label ?? ""
                }
                onChange={(label) => {
                  const selected = startTimeSlots.find(
                    (slot) => slot.label === label,
                  );

                  if (!selected) return;

                  const nextStart = selected.value;
                  const nextStartMinutes = toMinutes(nextStart);

                  setStartTime(nextStart);

                  if (
                    toMinutes(endTime) <= nextStartMinutes ||
                    toMinutes(endTime) > operatingHours.close
                  ) {
                    setEndTime(
                      minutesToTime(
                        Math.min(nextStartMinutes + 60, operatingHours.close),
                      ),
                    );
                  }
                }}
              />
            </div>
          </div>
          <div>
            <div>
              <FieldLabel htmlFor="book-end">End time</FieldLabel>

              <TimePicker
                id="book-end"
                ariaLabel="End time"
                placeholder="Select end time"
                options={endTimeSlots.map((slot) => slot.label)}
                value={
                  endTimeSlots.find((slot) => slot.value === endTime)?.label ??
                  ""
                }
                onChange={(label) => {
                  const selected = endTimeSlots.find(
                    (slot) => slot.label === label,
                  );

                  if (selected) {
                    setEndTime(selected.value);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-[12px] text-muted-foreground mt-2.5">
          {durationHours} hour{durationHours !== 1 ? "s" : ""} session · Open{" "}
          {operatingHours.isWeekend
            ? "9:00 AM - 10:00 PM on Saturdays and Sundays."
            : "10:00 AM - 8:00 PM on weekdays."}
        </p>
      </div>
    </section>
  );
}
