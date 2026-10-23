import { availableGames, devices } from "@/src/db/schema";

export type DeviceWithInstalledGames = {
    id: string;
    deviceName: string;
    type: (typeof devices.$inferSelect)["type"]; // "console" | "pc" | "arcade" | "vr"
    supportsFiltering: boolean | null;
    installedGames: string[];
};

export type DeviceWithSupportedGames = {
    id: string;
    deviceName: string;
    type: (typeof devices.$inferSelect)["type"];
    hourlyRate: string;
    supportedGames: Array<typeof availableGames.$inferSelect>;
};

export type gameCardProps = {
    id?: string;
    gameId?: string;
    name: string;
    imageUrl: string;
    genre: string[];
    rating: number;
    releaseYear: number;
    parentPlatforms: string[];
    platforms: string[];
    checked?: boolean;
    onCheck?: (id: string, checked?: boolean) => void;
    oncheck?: (id: string, checked?: boolean) => void;
};