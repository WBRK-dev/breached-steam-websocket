import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from "../Config/Redis.js";
import { Memory, Redis, type CacheDriver } from "../Drivers/Cache/index.js";

function getById(id: string): CacheDriver {
    switch (id) {
        case "redis":
            return getRedis();
        default:
            return getMemory();
    }
}

function getMemory() {
    return new Memory();
}

function getRedis() {
    return new Redis(
        REDIS_USERNAME!,
        REDIS_PASSWORD!,
        REDIS_HOST!,
        REDIS_PORT,
    );
}

export default {
    getById,
    getMemory,
    getRedis,
}
