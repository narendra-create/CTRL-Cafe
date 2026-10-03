import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_URL) {
    throw new Error(
        "Redis URL and token missing from env file"
    );
};

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});