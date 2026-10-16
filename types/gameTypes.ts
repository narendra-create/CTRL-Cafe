import { devices } from "@/src/db/schema";

export type DeviceWithInstalledGames = {
    id: string;
    deviceName: string;
    type: (typeof devices.$inferSelect)["type"]; // "console" | "pc" | "arcade" | "vr"
    supportsFiltering: boolean | null;
    installedGames: string[];
};