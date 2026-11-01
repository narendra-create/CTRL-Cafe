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
import type { DeviceType } from "@/types/bookingTypes";
import { devices, foodItems } from "@/src/db/schema";

type FoodItemType = typeof foodItems.$inferSelect;
type cartItemType = FoodItemType & { quantity: number };

export type SelectedDeviceArrayType = {
  id: string;
  stationId: string;
  stationLabel?: string;
  deviceId: string;
  deviceName: string;
  hourlyRate: string;
  maxPlayers: number;
  players: number;
  units?: number | string;
};

type BookingContextType = {
  selectedArena: DeviceType;
  setSelectedArena: Dispatch<SetStateAction<DeviceType>>;
  selectedDevices: SelectedDeviceArrayType[];
  toggleDevice: (
    station: { id: string; frontendLabel?: string },
    device: typeof devices.$inferSelect,
  ) => void;
  updateDevicePlayers: (id: string, delta: number) => void;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  startTime: string;
  setStartTime: Dispatch<SetStateAction<string>>;
  endTime: string;
  setEndTime: Dispatch<SetStateAction<string>>;
  selectedFoods: cartItemType[];
  setSelectedFoods: Dispatch<SetStateAction<cartItemType[]>>;
  setSelectedDevices: Dispatch<SetStateAction<SelectedDeviceArrayType[]>>;
  setFoodQuantity: (foodId: string, quantity: number) => void;
  addFood: (food: FoodItemType, quantity?: number) => void;
};
const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedArena, setSelectedArena] = useState<DeviceType>("CONSOLE");
  const [selectedDevices, setSelectedDevices] = useState<
    SelectedDeviceArrayType[]
  >([]);
  const [selectedFoods, setSelectedFoods] = useState<cartItemType[]>([]);

  const [date, setDate] = useState(() => getIndiaDateKey());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("20:00");

  function addFood(food: FoodItemType, quantity = 1) {
    setSelectedFoods((currentfoods) => {
      if (currentfoods?.some((cfood) => cfood.id === food.id)) {
        return currentfoods;
      }

      return [...currentfoods, { ...food, quantity }];
    });
  }

  function setFoodQuantity(id: string, quantity: number) {
    setSelectedFoods((currentfoods) => {
      if (quantity <= 0) {
        return currentfoods.filter((item) => item.id !== id);
      }

      return currentfoods.map((item) => {
        return item.id === id ? { ...item, quantity } : item;
      });
    });
  }

  function toggleDevice(
    station: { id: string; frontendLabel?: string },
    device: typeof devices.$inferSelect,
  ) {
    setSelectedDevices((prev) => {
      const exists = prev.some((d) => d.id === station.id);
      if (exists) {
        return prev.filter((d) => d.id !== station.id);
      }
      return [
        ...prev,
        {
          id: station.id,
          stationId: station.id,
          stationLabel: station.frontendLabel ?? "",
          deviceId: device.id,
          deviceName: device.deviceName,
          hourlyRate: device.hourlyRate,
          maxPlayers: device.maxPlayers,
          players: 1,
          units: 1,
        },
      ];
    });
  }

  function updateDevicePlayers(id: string, delta: number) {
    setSelectedDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextCount = Math.min(
          d.maxPlayers,
          Math.max(1, d.players + delta),
        );
        return { ...d, players: nextCount };
      }),
    );
  }

  return (
    <BookingContext.Provider
      value={{
        selectedArena,
        setSelectedArena,
        selectedDevices,
        toggleDevice,
        updateDevicePlayers,
        setSelectedDevices,
        date,
        setDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        selectedFoods,
        setSelectedFoods,
        setFoodQuantity,
        addFood,
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
