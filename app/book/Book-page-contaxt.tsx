"use client";
import {
  createContext,
  useContext,
  useEffect,
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

type DateandTimeObject = {
  startTime: string;
  endTime: string;
  date: string;
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
  setRazorpayOrderId: Dispatch<SetStateAction<string | null>>;
  razorpayOrderId: string | null;
};
const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedArena, setSelectedArena] = useState<DeviceType>("CONSOLE");
  const [selectedDevices, setSelectedDevices] = useState<
    SelectedDeviceArrayType[]
  >([]);
  const [selectedFoods, setSelectedFoods] = useState<cartItemType[]>([]);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null);

  const [date, setDate] = useState(() => getIndiaDateKey());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("20:00");

  //Populating states with localstorage values
  useEffect(() => {
    const storeddevices = localStorage.getItem("ctrl_cafe_selecteddevices");
    const storedfooditems = localStorage.getItem("ctrl_cafe_selectedfooditems");
    const storedrazorpayorderid = localStorage.getItem("ctrl_cafe_razorpayorderid");
    const storedtimes = localStorage.getItem("ctrl_cafe_storedtimes");

    if (storeddevices) {
      setSelectedDevices(JSON.parse(storeddevices));
    }
    if (storedfooditems) {
      setSelectedFoods(JSON.parse(storedfooditems));
    }
    if (storedrazorpayorderid) {
      setRazorpayOrderId(JSON.parse(storedrazorpayorderid));
    }
    if (storedtimes) {
      const timesObject: DateandTimeObject = JSON.parse(storedtimes);
      setStartTime(timesObject.startTime);
      setEndTime(timesObject.endTime);
      setDate(timesObject.date);
    }
  }, []);
  //Writitng into localstorage
  useEffect(() => {
    localStorage.setItem(
      "ctrl_cafe_selecteddevices",
      JSON.stringify(selectedDevices),
    );
  }, [selectedDevices]);

  useEffect(() => {
    localStorage.setItem(
      "ctrl_cafe_selectedfooditems",
      JSON.stringify(selectedFoods),
    );
  }, [selectedFoods]);

  useEffect(() => {
    localStorage.setItem("ctrl_cafe_razorpayorderid", JSON.stringify(razorpayOrderId));
  }, [razorpayOrderId]);

  useEffect(() => {
    const payload: DateandTimeObject = {
      date: date,
      endTime: endTime,
      startTime: startTime,
    };

    localStorage.setItem("ctrl_cafe_storedtimes", JSON.stringify(payload));
  }, [startTime, endTime, date]);

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
        setRazorpayOrderId,
        razorpayOrderId,
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
