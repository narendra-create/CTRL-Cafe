"use client";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getIndiaDateKey } from "@/lib/utils/tools";
import type { AllSelections, DeviceType } from "@/types/bookingTypes";

type BookingContextType = {
  selectedArena: DeviceType;
  setSelectedArena: Dispatch<SetStateAction<DeviceType>>;
  allSelections: AllSelections;
  setAllSelections: Dispatch<SetStateAction<AllSelections>>;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  startTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
  endTime: string;
  setEndTime: Dispatch<SetStateAction<string>>;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedArena, setSelectedArena] = useState<DeviceType>("CONSOLE");
  const [allSelections, setAllSelections] = useState<AllSelections>({});
  const [date, setDate] = useState(() => getIndiaDateKey());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("20:00");

  return (
    <BookingContext.Provider
      value={{
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
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }

  return context;
}