import Memory from "./Memory.js";
import Redis from "./Redis.js";

export {
    Memory,
    Redis,
}

export interface CacheDriver {
    get(key: string): Promise<string | undefined>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    delete(key: string): Promise<boolean>;
    has(key: string): Promise<boolean>;
    clear(): Promise<void>;
}
