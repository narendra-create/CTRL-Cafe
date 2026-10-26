"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type TimePickerProps = {
  id?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

export function TimePicker({
  options,
  value,
  onChange,
  placeholder = "Select time",
  ariaLabel,
  name,
  disabled = false,
  className = "",
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(options.indexOf(value), 0),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const selectedIndex = options.indexOf(value);

  const openDropdown = () => {
    setActiveIndex(Math.max(options.indexOf(value), 0));
    setOpen(true);
  };

  const selectOption = (option: string) => {
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

  // Keep the active option visible while navigating with the keyboard.
  useEffect(() => {
    if (!open) return;

    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, listboxId]);

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

      if (!options.length) return;

      setActiveIndex((current) =>
        event.key === "ArrowDown"
          ? (current + 1) % options.length
          : (current - 1 + options.length) % options.length,
      );

      return;
    }

    if (event.key === "Home" && open && options.length) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && open && options.length) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!open) {
        openDropdown();
      } else if (options[activeIndex] !== undefined) {
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
          open && options[activeIndex] !== undefined
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
          {options.map((option, index) => {
            const selected = option === value;
            const active = index === activeIndex;

            return (
              <div
                key={option}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={`
                  flex cursor-pointer items-center justify-between
                  rounded-lg px-3 py-2.5
                  text-sm transition-colors duration-150
                  ${
                    selected
                      ? "bg-yellow-400 font-semibold text-[#181214]"
                      : active
                        ? "bg-foreground/5 text-foreground dark:bg-white/[0.06] dark:text-[#F7F4EC]"
                        : "text-foreground hover:bg-foreground/5 dark:text-[#F7F4EC] dark:hover:bg-white/[0.06]"
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
