import { devices, gameStations } from "@/src/db/schema";

export type deviceCardType = {
    id: string;
    name: string;
    imageUrl: string;
    isNewDevice: boolean;
    units: string | number;
};

export type getDeviceInputType = {
    startTime?: string | Date;
    endTime?: string | Date;
}

export type StationWithStatus = typeof gameStations.$inferSelect & {
    isBooked: boolean;
};

export type DeviceWithStations = typeof devices.$inferSelect & {
    game_stations: Array<StationWithStatus>;
};