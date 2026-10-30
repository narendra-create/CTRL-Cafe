import { devices, gameStations } from "@/src/db/schema";

export type deviceCardType = {
    id: string;
    name: string;
    imageUrl: string;
    isNewDevice: boolean;
    units: string | number;
};

export type DeviceWithStations = typeof devices.$inferSelect & {
    game_stations: Array<typeof gameStations.$inferSelect>;
};