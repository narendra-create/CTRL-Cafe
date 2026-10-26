"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { getIndiaDateKey, isBookableDate } from "@/lib/utils/tools";

interface DatePickerSimpleProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function parseDateKey(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Construct a local date. Avoid new Date("YYYY-MM-DD"),
  // which interprets the string as UTC.
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value: string): string {
  const date = parseDateKey(value);

  if (!date) return "Choose a date";

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DatePickerSimple({
  selectedDate,
  onDateSelect,
}: DatePickerSimpleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initialDate =
      parseDateKey(selectedDate) ?? parseDateKey(getIndiaDateKey())!;

    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const todayKey = getIndiaDateKey();
  const today = parseDateKey(todayKey)!;

  // Keep the displayed month in sync if the parent changes its date.
  useEffect(() => {
    const selected = parseDateKey(selectedDate);

    if (selected) {
      setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [selectedDate]);

  // Close the calendar when clicking outside it.
  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isOpen]);

  const days = useMemo(() => {
    const firstOfMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );

    // Monday-first calendar.
    const offset = (firstOfMonth.getDay() + 6) % 7;

    const gridStart = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1 - offset,
    );

    // Six rows prevent the calendar from changing height between months.
    return Array.from({ length: 42 }, (_, index) => {
      return new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      );
    });
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const currentMonthIndex = today.getFullYear() * 12 + today.getMonth();

  const visibleMonthIndex =
    visibleMonth.getFullYear() * 12 + visibleMonth.getMonth();

  const canGoPrevious = visibleMonthIndex > currentMonthIndex;

  function changeMonth(delta: number) {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + delta, 1),
    );
  }

  function selectDate(date: Date) {
    const key = toDateKey(date);

    // Guard against past dates even if this handler is triggered
    // programmatically instead of through normal button interaction.
    if (!isBookableDate(key, todayKey)) return;

    onDateSelect(key);
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      }}
    >
      {/* Field label */}
      <label className="mb-2 block text-[11px] font-[700] uppercase tracking-[0.14em] text-muted-foreground">
        Session date
      </label>

      {/* Trigger */}
      <button
        type="button"
        aria-label={`Booking date: ${formatSelectedDate(selectedDate)}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="group flex min-h-[48px] w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-[14px] py-2.5 text-left outline-none transition-colors duration-200 hover:border-accent/60 focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgba(250,204,21,0.13)]"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
            <CalendarDays size={17} strokeWidth={1.8} />
          </span>

          <span className="min-w-0">
            <span className="block truncate text-[13px] font-[650] text-foreground">
              {formatSelectedDate(selectedDate)}
            </span>

            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Choose your session
            </span>
          </span>
        </span>

        <ChevronRight
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-90 text-accent" : ""
          }`}
        />
      </button>

      {/* Calendar popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose booking date"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
        >
          {/* Month navigation */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Previous month"
              disabled={!canGoPrevious}
              onClick={() => changeMonth(-1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft size={17} />
            </button>

            <div className="text-center">
              <p className="text-[15px] font-[700] tracking-[-0.02em] text-foreground">
                {monthLabel}
              </p>

              <p className="mt-1 text-[9px] font-[700] uppercase tracking-[0.2em] text-accent">
                Pick your play date
              </p>
            </div>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:bg-muted hover:text-foreground"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          {/* Weekday headings */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday}
                className="grid h-7 place-items-center text-[9px] font-[700] tracking-[0.06em] text-muted-foreground"
              >
                {weekday}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const key = toDateKey(day);
              const isPast = key < todayKey;
              const isSelected = key === selectedDate;
              const isToday = key === todayKey;
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isPast}
                  aria-label={formatSelectedDate(key)}
                  aria-pressed={isSelected}
                  title={isPast ? "Past dates are unavailable" : undefined}
                  onClick={() => selectDate(day)}
                  className={[
                    "relative grid h-10 w-full place-items-center rounded-lg text-[12px] font-[600] transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isPast
                      ? "cursor-not-allowed text-muted-foreground/25"
                      : isSelected
                        ? "bg-accent text-accent-foreground shadow-[0_3px_10px_rgba(250,204,21,0.15)]"
                        : isCurrentMonth
                          ? "text-foreground hover:bg-accent/10"
                          : "text-muted-foreground/50 hover:bg-muted",
                    isToday && !isSelected ? "border border-accent/60" : "",
                  ].join(" ")}
                >
                  {day.getDate()}

                  {isToday && (
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-1 h-1 w-1 rounded-full ${
                        isSelected ? "bg-accent-foreground" : "bg-accent"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />

            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Today onward. Past dates are unavailable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
