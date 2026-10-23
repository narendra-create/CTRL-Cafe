import z from "zod";

export const addGamesSchema = z.object({
    deviceIds: z.array(z.string()).min(1),
    games: z.array(z.object({
        gameName: z.string().min(2),
        gameGenre: z.string(),
        imageUrl: z.string(),
        releaseYear: z.number().nonnegative()
    }))
});

export const unLinkGamesSchema = z.object({
    deviceId: z.uuid(),
    gameIds: z.array(z.uuid()).min(1)
})

export type addGamesInput = z.infer<typeof addGamesSchema>;
export type UnlinkGamesInput = z.infer<typeof unLinkGamesSchema>;