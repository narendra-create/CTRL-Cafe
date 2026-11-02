export interface StationReviewItem {
  id: string;
  name: string;
  stationNumber: number;
  players: number;
  maxPlayers: number;
  ratePerPlayerPerHour: number;
  durationHours: number;
  total: number;
}

export interface DeviceReviewGroup {
  deviceType: "CONSOLE" | "PC" | "ARCADE" | "VR";
  deviceTitle: string;
  hourlyRateText: string;
  ratePerPlayerPerHour: number;
  stations: StationReviewItem[];
}

export interface SnackReviewItem {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
  imageUrl?: string;
  category?: string;
}

export interface BookingReviewData {
  schedule: {
    dateFormatted: string;
    isoDate: string;
    startsAt: string;
    endsAt: string;
    durationFormatted: string;
    durationHours: number;
    totalPlayers: number;
  };
  deviceChips: Array<{
    count: number;
    label: string;
  }>;
  deviceGroups: DeviceReviewGroup[];
  devicesTotal: number;
  totalPlayers: number;
  snacks: SnackReviewItem[];
  snacksTotal: number;
  grandTotal: number;
}

export const mockBookingReview: BookingReviewData = {
  schedule: {
    dateFormatted: "Mon, 2 Nov 2026",
    isoDate: "2026-11-02",
    startsAt: "4:00 PM",
    endsAt: "6:00 PM",
    durationFormatted: "2 hours",
    durationHours: 2,
    totalPlayers: 10,
  },
  deviceChips: [
    { count: 3, label: "PS5" },
    { count: 1, label: "PC" },
  ],
  deviceGroups: [
    {
      deviceType: "CONSOLE",
      deviceTitle: "PlayStation 5",
      hourlyRateText: "₹50 per player, per hour",
      ratePerPlayerPerHour: 50,
      stations: [
        {
          id: "ps5-st-1",
          name: "PS5 · Station 1",
          stationNumber: 1,
          players: 3,
          maxPlayers: 4,
          ratePerPlayerPerHour: 50,
          durationHours: 2,
          total: 300,
        },
        {
          id: "ps5-st-2",
          name: "PS5 · Station 2",
          stationNumber: 2,
          players: 2,
          maxPlayers: 4,
          ratePerPlayerPerHour: 50,
          durationHours: 2,
          total: 200,
        },
        {
          id: "ps5-st-3",
          name: "PS5 · Station 3",
          stationNumber: 3,
          players: 4,
          maxPlayers: 4,
          ratePerPlayerPerHour: 50,
          durationHours: 2,
          total: 400,
        },
      ],
    },
    {
      deviceType: "PC",
      deviceTitle: "Gaming PC",
      hourlyRateText: "₹60 per player, per hour",
      ratePerPlayerPerHour: 60,
      stations: [
        {
          id: "pc-st-1",
          name: "PC · Station 1",
          stationNumber: 1,
          players: 1,
          maxPlayers: 1,
          ratePerPlayerPerHour: 60,
          durationHours: 2,
          total: 120,
        },
      ],
    },
  ],
  devicesTotal: 1020,
  totalPlayers: 10,
  snacks: [
    {
      id: "snack-1",
      name: "Momos",
      quantity: 2,
      pricePerUnit: 99,
      total: 198,
      imageUrl: "https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg",
      category: "Steamed Dumplings",
    },
    {
      id: "snack-2",
      name: "Cheese Burger",
      quantity: 1,
      pricePerUnit: 129,
      total: 129,
      imageUrl: "https://images.pexels.com/photos/32480062/pexels-photo-32480062.jpeg",
      category: "Signature Burger",
    },
    {
      id: "snack-3",
      name: "Fried Rice",
      quantity: 1,
      pricePerUnit: 119,
      total: 119,
      imageUrl: "https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg",
      category: "Wok Specials",
    },
  ],
  snacksTotal: 446,
  grandTotal: 1466,
};
