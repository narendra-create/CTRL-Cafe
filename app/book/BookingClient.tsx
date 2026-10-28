"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { DatePickerSimple } from "@/components/Date-Picker";
import {
  createTimeSlots,
  getIndiaDateKey,
  getOperatingHours,
  minutesToTime,
} from "@/lib/utils/tools";
import { TimePicker } from "@/components/ui/time-picker";
import { fromZonedTime } from "date-fns-tz";
import { AllSelections, Arena, DeviceType } from "@/types/bookingTypes";

const timeZone = "Asia/Kolkata";

/* Section: Static Data */
const ARENAS: Arena[] = [
  {
    key: "CONSOLE",
    label: "Console",
    subLabel: "Big-screen battles",
    eyebrow: "PLAY TOGETHER",
    description: "Grab a controller. Bring the rivalry.",
    tags: ["PS5", "Xbox", "Co-op", "Sports"],
    price: 50,
    totalUnits: 5,
    maxPlayers: 4,
  },
  {
    key: "PC",
    label: "PC",
    subLabel: "High FPS · Precision",
    eyebrow: "PLAY TO WIN",
    description: "High refresh monitors and fast rigs.",
    tags: ["Valorant", "CS2", "GTA V"],
    price: 80,
    totalUnits: 6,
    maxPlayers: 2,
  },
  {
    key: "ARCADE",
    label: "Arcade",
    subLabel: "Beat the high score",
    eyebrow: "PLAY TOGETHER",
    description: "Classic cabinets, new rivalries.",
    tags: ["Racing", "Fighting"],
    price: 60,
    totalUnits: 2,
    maxPlayers: 2,
  },
  {
    key: "VR",
    label: "VR",
    subLabel: "Enter another world",
    eyebrow: "PLAY IMMERSIVE",
    description: "Full-room VR. One headset per device.",
    tags: ["Beat Saber", "Horror", "Sim"],
    price: 150,
    totalUnits: 1,
    maxPlayers: 2,
  },
];

/* Booked device indices per arena (0-indexed) */
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
          isSelected
            ? "text-accent-foreground/60"
            : "text-background/50"
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
      className={`rounded-2xl border p-[14px] transition-all duration-150 select-none ${
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
          className="mt-2.5 md:max-w-[95%] flex items-center justify-between bg-muted rounded-[10px] px-1 md:px-2 py-0.5 md:py-3 border border-black/20 dark:border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Fewer players"
            onClick={() => onAdjust(-1)}
            className="w-7 h-7 rounded-[8px] bg-accent text-accent-foreground cursor-pointer flex items-center justify-center shrink-0"
          >
            <Minus size={12} strokeWidth={3} />
          </button>
          <span className="text-[12px] md:text-[15px] font-semibold">
            {players} player{players > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            aria-label="More players"
            onClick={() => onAdjust(1)}
            className="w-7 h-7 rounded-[8px] bg-accent text-accent-foreground cursor-pointer flex items-center justify-center shrink-0"
          >
            <Plus size={12} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}

/* Section: Booking Summary Sidebar */

function BookingSidebar({
  allSelections,
  durationHours,
  canProceed,
  onClearAll,
}: {
  allSelections: AllSelections;
  durationHours: number;
  canProceed: boolean;
  onClearAll: () => void;
}) {
  /* Build line items per arena */
  const lineItems = ARENAS.flatMap((arena) => {
    const sel = allSelections[arena.key] ?? {};
    const deviceIds = Object.keys(sel).map(Number);
    if (deviceIds.length === 0) return [];
    const totalPlayers = deviceIds.reduce((acc, id) => acc + sel[id], 0);
    const subtotal = deviceIds.length * arena.price * durationHours;
    return [{ arena, deviceCount: deviceIds.length, totalPlayers, subtotal }];
  });

  const grandTotal = lineItems.reduce((acc, li) => acc + li.subtotal, 0);
  const totalDevices = lineItems.reduce((acc, li) => acc + li.deviceCount, 0);
  const totalPlayers = lineItems.reduce((acc, li) => acc + li.totalPlayers, 0);

  return (
    <aside className="w-full lg:w-[320px] xl:w-[360px]  shrink-0">
      <div className="lg:sticky lg:top-28 rounded-2xl border border-black/20 shadow-[0px_4px_10px_0px_#e2e8f0] dark:shadow-none dark:border-border bg-background overflow-hidden">
        {/* Section: Sidebar Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-[10px] md:text-[15px] font-extrabold tracking-[0.11em] text-muted-foreground uppercase">
              Your booking
            </p>
            {canProceed && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] font-bold text-muted-foreground hover:text-destructive transition-colors duration-150 cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
          <p className="text-[22px] md:text-2xl font-bold tracking-[-0.03em] leading-tight">
            {canProceed ? `₹${grandTotal}` : "₹0"}
          </p>
          <p className="text-[12px] md:text-[15px] text-foreground/60 dark:text-muted-foreground mt-1">
            {!canProceed
              ? "Pick a device to start"
              : `${totalDevices} device${totalDevices > 1 ? "s" : ""} · ${totalPlayers} player${totalPlayers > 1 ? "s" : ""} · ${durationHours} hr`}
          </p>
        </div>

        {/* Section: Sidebar Line Items */}
        <div className="px-5 py-4 min-h-[80px] border-t md:mt-3 md:pt-6 border-black/30">
          {lineItems.length === 0 ? (
            <p className="text-[13px] text-muted-foreground text-center py-4">
              No devices selected yet.
            </p>
          ) : (
            <ul className="grid gap-3 divide-y divide-black/25">
              {lineItems.map(
                ({ arena, deviceCount, totalPlayers: pl, subtotal }) => (
                  <li
                    key={arena.key}
                    className="flex items-start justify-between gap-3 pb-3"
                  >
                    <div>
                      <p className="text-[13px] md:text-lg font-bold">
                        {deviceCount} x {arena.label}
                      </p>
                      <p className="text-[11px] md:text-[12px] text-foreground/60 dark:text-muted-foreground mt-0.5">
                        {pl} player{pl > 1 ? "s" : ""} · ₹{arena.price}/hr each
                      </p>
                    </div>
                    <p className="text-[13px] md:text-lg font-bold shrink-0">
                      ₹{subtotal}
                    </p>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>

        {/* Section: Sidebar Stats */}
        {canProceed && (
          <div className="mx-5 mb-4 rounded-xl bg-muted/50 border border-black/30 dark:border-border px-4 py-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[18px] font-extrabold leading-tight">
                {totalDevices}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-[600] mt-0.5">
                Devices
              </p>
            </div>
            <div className="border-x border-black/30 dark:border-border">
              <p className="text-[18px] font-[800] leading-tight">
                {totalPlayers}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-[600] mt-0.5">
                Players
              </p>
            </div>
            <div>
              <p className="text-[18px] font-[800] leading-tight">
                {durationHours}h
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-[600] mt-0.5">
                Duration
              </p>
            </div>
          </div>
        )}

        {/* Section: Sidebar CTA */}
        <div className="px-5 pb-5">
          <button
            type="button"
            disabled={!canProceed}
            className="w-full bg-accent text-accent-foreground rounded-xl py-3.5 text-[14px] font-[700] cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-lg disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Proceed to snacks
          </button>
          {!canProceed && (
            <p className="text-[11px] text-muted-foreground text-center mt-2.5">
              Select at least one device to continue
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

/* Section: Mobile Summary Bar */

function MobileSummaryBar({
  totalDevices,
  totalPlayers,
  durationHours,
  grandTotal,
  canProceed,
}: {
  totalDevices: number;
  totalPlayers: number;
  durationHours: number;
  grandTotal: number;
  canProceed: boolean;
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 z-40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[22px] font-[700] tracking-[-0.03em] leading-tight">
            {canProceed ? `₹${grandTotal}` : "₹0"}
          </p>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {!canProceed
              ? "Pick a device to start"
              : `${totalDevices} device${totalDevices > 1 ? "s" : ""} · ${totalPlayers} player${totalPlayers > 1 ? "s" : ""} · ${durationHours} hr`}
          </p>
        </div>
        <button
          type="button"
          disabled={!canProceed}
          className="bg-accent text-accent-foreground rounded-xl px-5 py-3 text-[14px] font-[700] cursor-pointer transition-all duration-150 whitespace-nowrap disabled:opacity-35 disabled:cursor-not-allowed"
        >
          Proceed to snacks
        </button>
      </div>
    </div>
  );
}

/* Section: Main Component */
export default function BookingClient() {
  const [selectedArena, setSelectedArena] = useState<DeviceType>("CONSOLE");
  const [allSelections, setAllSelections] = useState<AllSelections>({});
  const [date, setDate] = useState(() => getIndiaDateKey());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("20:00");

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

  /* Cross-arena totals for sidebar */
  const lineItems = ARENAS.flatMap((a) => {
    const sel = allSelections[a.key] ?? {};
    const ids = Object.keys(sel).map(Number);
    if (ids.length === 0) return [];
    return [
      {
        arena: a,
        deviceCount: ids.length,
        players: ids.reduce((acc, id) => acc + sel[id], 0),
      },
    ];
  });

  const totalDevices = lineItems.reduce((acc, li) => acc + li.deviceCount, 0);
  const totalPlayers = lineItems.reduce((acc, li) => acc + li.players, 0);
  const grandTotal = lineItems.reduce(
    (acc, li) => acc + li.deviceCount * li.arena.price * durationHours,
    0,
  );
  const canProceed = totalDevices > 0 && durationHours > 0;
  //Needed when posting to database
  // const startAt = fromZonedTime(`${date}T${startTime}:00`, timeZone);
  // const endAt = fromZonedTime(`${date}T${endTime}:00`, timeZone);

  function handleArenaChange(key: DeviceType) {
    setSelectedArena(key);
  }

  function handleDateChange(nextDate: string) {
    const hours = getOperatingHours(nextDate);

    const currentStart = toMinutes(startTime);

    // Keep the current start time if it fits the new day's hours.
    const nextStart =
      currentStart >= hours.open && currentStart <= hours.close - 30
        ? startTime
        : minutesToTime(hours.open);

    const nextStartMinutes = toMinutes(nextStart);
    const currentEnd = toMinutes(endTime);

    // Keep the end time only if it remains valid.
    const nextEnd =
      currentEnd > nextStartMinutes && currentEnd <= hours.close
        ? endTime
        : minutesToTime(Math.min(nextStartMinutes + 60, hours.close));

    setDate(nextDate);
    console.log(Date, nextDate);
    console.log(getOperatingHours(nextDate));
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
    <div className="min-h-screen pt-20 md:pt-24 pb-24 lg:pb-8">
      <div className="w-full max-w-450 mx-auto px-4 md:px-8 lg:px-12">
        {/* Section: Header */}
        <div className="mt-6 md:mt-8 mb-8 md:mb-10">
          <h1 className="text-lg md:text-7xl font-bold tracking-[-0.03em] leading-tight">
            Reserve a device<span className="text-accent">.</span>
          </h1>
          <p className="text-muted-foreground text-[15px] mt-2 max-w-[44em] leading-relaxed">
            Pick an arena, choose your devices and set your time. Each device is
            a full unit — bring the whole squad.
          </p>
        </div>

        {/* Section: Two-Column Layout */}
        <div className="flex flex-col md:mx-7 lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Section: Main Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 md:gap-10">
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
                              Math.min(
                                nextStartMinutes + 60,
                                operatingHours.close,
                              ),
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
                        endTimeSlots.find((slot) => slot.value === endTime)
                          ?.label ?? ""
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
                {durationHours} hour{durationHours !== 1 ? "s" : ""} session ·{" "}
                Open{" "}
                {operatingHours.isWeekend
                  ? "9:00 AM - 10:00 PM on Saturdays and Sundays."
                  : "10:00 AM - 8:00 PM on weekdays."}
              </p>
            </div>
          </div>

          {/* Section: Booking Sidebar (desktop only) */}
          <BookingSidebar
            allSelections={allSelections}
            durationHours={durationHours}
            canProceed={canProceed}
            onClearAll={() => setAllSelections({})}
          />
        </div>
      </div>

      {/* Section: Mobile Summary Bar */}
      <MobileSummaryBar
        totalDevices={totalDevices}
        totalPlayers={totalPlayers}
        durationHours={durationHours}
        grandTotal={grandTotal}
        canProceed={canProceed}
      />
    </div>
  );
}
