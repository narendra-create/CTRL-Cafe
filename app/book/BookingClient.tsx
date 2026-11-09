"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Minus, Plus, RotateCw } from "lucide-react";
import { DatePickerSimple } from "@/components/Date-Picker";
import {
  createTimeSlots,
  getOperatingHours,
  minutesToTime,
  toIndiaDateTime,
} from "@/lib/utils/tools";
import { TimePicker } from "@/components/ui/time-picker";
import { Arena, DeviceType } from "@/types/bookingTypes";
import { useBooking } from "@/app/book/Book-page-contaxt";
import { ARENAS } from "@/lib/static-data/Booking-data";
import { DeviceWithStations } from "@/types/deviceTypes";

export interface BookingClientProps {
  initialDevice: DeviceType;
  devices?: DeviceWithStations[];
  onAvailibilityCheck: (
    startTime: string | Date,
    endTime?: string | Date,
  ) => Promise<{ error?: string; data?: any }>;
}

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

function ArenaInfoCard({
  arena,
  freeUnits,
}: {
  arena: Arena;
  freeUnits?: number;
}) {
  const availableUnits = freeUnits ?? arena.totalUnits;

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
          {availableUnits} of {arena.totalUnits} free
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
      className={`rounded-2xl border p-3 md:p-3.5 transition-all duration-150 select-none ${
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
  devices = [],
  onAvailibilityCheck,
}: BookingClientProps) {
  const router = useRouter();

  const {
    selectedArena,
    setSelectedArena,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedDevices,
    toggleDevice,
    updateDevicePlayers,
  } = useBooking();

  // Flag: Shows "Check Availability" button after user picks a custom date/time
  const [hasCustomTimeSelected, setHasCustomTimeSelected] = useState(false);
  const [deviceList, setDeviceList] = useState<DeviceWithStations[]>(devices);
  // UI state placeholders
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [deviceFetchError, setDeviceFetchError] = useState<string | null>(null);

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

  const durationHours = Math.max(
    0,
    (toMinutes(endTime) - toMinutes(startTime)) / 60,
  );

  function handleArenaChange(key: DeviceType) {
    setSelectedArena(key);
  }

  async function handleCheckAvailability() {
    setIsLoadingDevices(true);
    setDeviceFetchError(null);
    try {
      const checkstartTime = toIndiaDateTime(date, startTime);
      const checkendTime = toIndiaDateTime(date, endTime);
      const result = await onAvailibilityCheck(checkstartTime, checkendTime);
      if (result.error) {
        setIsLoadingDevices(false);
        setDeviceFetchError(result.error);
        return;
      }

      setDeviceList(result.data);
    } catch (err) {
      setDeviceFetchError("Could not connect to server. Please try again.");
    } finally {
      setIsLoadingDevices(false);
    }
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
    setHasCustomTimeSelected(true);
  }

  const visibleDevices = deviceList.filter(
    (d) => d.type.toUpperCase() === selectedArena,
  );

  const arenaStations = visibleDevices.flatMap((d) => d.game_stations ?? []);
  const totalUnits = arenaStations.length;
  const freeUnits = arenaStations.filter((s) => !s.isBooked).length;

  return (
    <section className="flex flex-col gap-8 md:gap-10">
      {/* 1. Section: Header */}
      <div className="mt-6 md:mt-8 mb-4 md:mb-6">
        <h1 className="text-3xl md:text-7xl font-bold tracking-[-0.03em] leading-tight">
          Reserve a device<span className="text-accent">.</span>
        </h1>
        <p className="text-muted-foreground text-xs mx-2.5 md:mx-0 md:text-[15px] mt-2 max-w-[44em] leading-relaxed">
          Pick an arena, choose your devices and set your time. Each device is a
          full unit — bring the whole squad.
        </p>
      </div>

      {/* 2. Section: Date and Time (Moved to Top) */}
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
                selectedDate={date}
                timeZone="Asia/Kolkata"
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
                  setHasCustomTimeSelected(true);

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
                selectedDate={date}
                timeZone="Asia/Kolkata"
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
                    setHasCustomTimeSelected(true);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
          <p className="text-[12px] text-muted-foreground">
            {durationHours} hour{durationHours !== 1 ? "s" : ""} session · Open{" "}
            {operatingHours.isWeekend
              ? "9:00 AM - 10:00 PM on Saturdays and Sundays."
              : "10:00 AM - 8:00 PM on weekdays."}
          </p>

          {hasCustomTimeSelected && (
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs md:text-sm font-bold text-accent-foreground shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Check Availability
            </button>
          )}
        </div>
      </div>

      {/* 3. Section: Arena & Device Selector (Moved to Bottom with Loader & Error UI) */}
      <div className="flex flex-col gap-8 md:gap-10">
        {isLoadingDevices ? (
          /* ========================================================================= */
          /* PLACEHOLDER: ADD LOADER COMPONENT HERE IN FUTURE                          */
          /* ========================================================================= */
          <div className="rounded-2xl border border-border bg-card/50 p-12 text-center flex flex-col items-center justify-center gap-3 animate-pulse">
            {/* Replace this div with your custom loader component */}
            <p className="text-sm font-semibold text-muted-foreground">
              Checking available devices & stations...
            </p>
          </div>
        ) : deviceFetchError ? (
          /* ========================================================================= */
          /* ERROR UI: Shown when device/station availability check fails              */
          /* ========================================================================= */
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 p-6 md:p-8 text-center flex flex-col items-center justify-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Unable to load devices
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-md">
                {deviceFetchError ||
                  "We could not check device availability for the selected time. Please try again."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs md:text-sm font-semibold hover:bg-muted transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <RotateCw size={14} />
              Try Again
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* STATIONS & DEVICES: Arena selection and device grid                      */
          /* ========================================================================= */
          <>
            {/* Arena Selection */}
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
              <ArenaInfoCard arena={arena} freeUnits={freeUnits} />
            </div>

            {/* Device Picker */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <SectionLabel>
                  Pick your {arena.label.toLowerCase()} devices
                </SectionLabel>
                <span className="text-[11px] md:text-[12px] text-red-600 dark:text-red-400 font-semibold -mt-3">
                  {freeUnits} of {totalUnits} available
                </span>
              </div>

              {/* Scrollable device grid */}
              <div className="max-h-105 overflow-y-auto rounded-2xl border border-black/12 dark:border-border bg-foreground/1 dark:bg-muted/20 p-3 scrollbar-thin">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {visibleDevices.flatMap((device) =>
                    device.game_stations.map((station, index) => {
                      const selected = selectedDevices.find(
                        (selectedDevice) => selectedDevice.id === station.id,
                      );
                      const isSelected = Boolean(selected);
                      const players = selected?.players ?? 0;

                      return (
                        <DeviceCard
                          key={station.id}
                          arena={arena}
                          deviceNumber={index + 1}
                          isBooked={station.isBooked}
                          players={players}
                          onToggle={() => toggleDevice(station, device)}
                          onAdjust={(delta) =>
                            updateDevicePlayers(station.id, delta)
                          }
                        />
                      );
                    }),
                  )}
                </div>
              </div>
              <p className="text-[12px] md:mb-12 text-muted-foreground mt-2.5">
                You book the whole device unit, Per player charge.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
