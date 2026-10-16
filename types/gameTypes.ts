import { devices } from "@/src/db/schema";

export type DeviceWithInstalledGames = {
    id: string;
    deviceName: string;
    type: (typeof devices.$inferSelect)["type"]; // "console" | "pc" | "arcade" | "vr"
    supportsFiltering: boolean | null;
    installedGames: string[];
};

export type gameCardProps = {
    name: string;
    imageUrl: string;
    genre: string[];
    rating: number;
    releaseYear: number;
    parentPlatforms: string[];
    platforms: string[];
}