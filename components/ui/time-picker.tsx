"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type TimePickerProps = {
  id?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  selectedDate: string; // YYYY-MM-DD
  timeZone?: string;
  placeholder?: string;
  ariaLabel?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

// Get the date in the booking location's timezone.
function getDateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

// Get current hour and minute in the booking location's timezone.
function getMinutesInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value);

  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  return hour * 60 + minute;
}

// Convert "14:30" or "2:30 PM" into minutes since midnight.
function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)?$/i);

  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period) {
    if (hour < 1 || hour > 12) return null;

    hour = (hour % 12) + (period === "PM" ? 12 : 0);
  } else if (hour > 23) {
    return null;
  }

  return hour * 60 + minute;
}

function isTimeDisabled(time: string, isToday: boolean, nowMinutes: number) {
  if (!isToday) return false;

  const optionMinutes = parseTimeToMinutes(time);

  return optionMinutes === null || optionMinutes < nowMinutes;
}

export function TimePicker({
  options,
  value,
  onChange,
  selectedDate,
  timeZone = "Asia/Kolkata",
  placeholder = "Select time",
  ariaLabel,
  name,
  disabled = false,
  className = "",
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [nowMinutes, setNowMinutes] = useState(() =>
    getMinutesInTimeZone(new Date(), timeZone),
  );
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const todayKey = getDateKeyInTimeZone(new Date(), timeZone);
  const isToday = selectedDate === todayKey;

  const selectedIndex = options.indexOf(value);

  const isOptionDisabled = (option: string) =>
    isTimeDisabled(option, isToday, nowMinutes);

  const enabledIndices = options.reduce<number[]>((indices, option, index) => {
    if (!isOptionDisabled(option)) {
      indices.push(index);
    }

    return indices;
  }, []);

  // Keep current time updated while the component is mounted.
  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentMinutes = getMinutesInTimeZone(new Date(), timeZone);

      setNowMinutes((previous) =>
        previous === currentMinutes ? previous : currentMinutes,
      );
    }, 15_000);

    return () => window.clearInterval(interval);
  }, [timeZone]);

  // Automatically select the first available time for today.
  useEffect(() => {
    if (!isToday) return;

    const selectedIsValid = options.includes(value) && !isOptionDisabled(value);

    if (selectedIsValid) return;

    const firstAvailable =
      options.find((option) => !isOptionDisabled(option)) ?? "";

    if (value !== firstAvailable) {
      onChange(firstAvailable);
    }
  }, [isToday, nowMinutes, options, value, onChange]);

  const openDropdown = () => {
    const selectedIsAvailable =
      selectedIndex >= 0 && !isOptionDisabled(options[selectedIndex]);

    setActiveIndex(
      selectedIsAvailable ? selectedIndex : (enabledIndices[0] ?? -1),
    );

    setOpen(true);
  };

  const selectOption = (option: string) => {
    // Recheck the actual current time before accepting a selection.
    const currentDate = new Date();

    const currentlyToday =
      selectedDate === getDateKeyInTimeZone(currentDate, timeZone);

    const currentMinutes = getMinutesInTimeZone(currentDate, timeZone);

    if (isTimeDisabled(option, currentlyToday, currentMinutes)) {
      return;
    }

    onChange(option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Close when clicking outside the dropdown.
  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [open]);

  // Move active index if the currently active option becomes disabled.
  useEffect(() => {
    if (!open || enabledIndices.includes(activeIndex)) return;

    setActiveIndex(enabledIndices[0] ?? -1);
  }, [open, activeIndex, nowMinutes, isToday, options]);

  // Keep the active option visible during keyboard navigation.
  useEffect(() => {
    if (!open || activeIndex < 0) return;

    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, listboxId]);

  const moveActive = (direction: -1 | 1) => {
    if (!enabledIndices.length) return;

    setActiveIndex((current) => {
      const position = enabledIndices.indexOf(current);

      if (position === -1) {
        return direction === 1
          ? enabledIndices[0]
          : enabledIndices[enabledIndices.length - 1];
      }

      const nextPosition =
        (position + direction + enabledIndices.length) % enabledIndices.length;

      return enabledIndices[nextPosition];
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        openDropdown();
        return;
      }

      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Home" && open && enabledIndices.length) {
      event.preventDefault();
      setActiveIndex(enabledIndices[0]);
      return;
    }

    if (event.key === "End" && open && enabledIndices.length) {
      event.preventDefault();
      setActiveIndex(enabledIndices[enabledIndices.length - 1]);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!open) {
        openDropdown();
      } else if (activeIndex >= 0 && options[activeIndex]) {
        selectOption(options[activeIndex]);
      }
    }
  };

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger */}
      <button
        id={id}
        ref={triggerRef}
        type="button"
        role="combobox"
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open &&
          activeIndex >= 0 &&
          options[activeIndex] &&
          !isOptionDisabled(options[activeIndex])
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openDropdown();
          }
        }}
        onKeyDown={handleKeyDown}
        className="
          flex w-full items-center justify-between gap-3
          rounded-xl border border-border
          bg-background px-[14px] py-[13px]
          text-left text-[14px] font-medium text-foreground
          outline-none transition-all duration-200
          hover:border-foreground/30
          focus:border-yellow-400
          focus:shadow-[0_0_0_3px_rgba(250,204,21,0.13)]
          disabled:cursor-not-allowed disabled:opacity-50
          dark:bg-[#181214]
        "
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {selectedIndex >= 0 ? value : placeholder}
        </span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
          className="
            absolute left-0 top-full z-50 mt-2
            max-h-60 w-full overflow-y-auto
            rounded-xl border border-border
            bg-background p-1.5
            shadow-xl shadow-black/20
            dark:border-white/10
            dark:bg-[#211b1d]
          "
        >
          {isToday && enabledIndices.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No remaining time slots for today.
            </p>
          )}

          {options.map((option, index) => {
            const selected = option === value;
            const active = index === activeIndex;
            const optionDisabled = isOptionDisabled(option);

            return (
              <div
                key={option}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={selected}
                aria-disabled={optionDisabled}
                onMouseEnter={() => {
                  if (!optionDisabled) setActiveIndex(index);
                }}
                onClick={() => selectOption(option)}
                className={`
                  flex items-center justify-between
                  rounded-lg px-3 py-2.5
                  text-sm transition-colors duration-150
                  ${
                    optionDisabled
                      ? "cursor-not-allowed text-muted-foreground/40"
                      : selected
                        ? "cursor-pointer bg-yellow-400 font-semibold text-[#181214]"
                        : active
                          ? "cursor-pointer bg-foreground/5 text-foreground dark:bg-white/[0.06] dark:text-[#F7F4EC]"
                          : "cursor-pointer text-foreground hover:bg-foreground/5 dark:text-[#F7F4EC] dark:hover:bg-white/[0.06]"
                  }
                `}
              >
                <span>{option}</span>

                {selected && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
