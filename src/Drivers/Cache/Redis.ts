import type { CacheDriver } from "./index.js";
import { createClient } from "redis";

export default class Redis implements CacheDriver {
    private client;

    constructor(
        username: string,
        password: string,
        host: string,
        port: number,
    ) {
        this.client = createClient({
            username,
            password,
            socket: {
                host,
                port,
                tls: false,
            }
        });
        if (!this.client)
            throw new Error("Error creating redis client");

        this.client.on('error', console.log);
        this.client.connect();
    }

    async get(key: string) {
        return await this.client.get(key) || undefined;
    }

    async set(key: string, value: any, ttl?: number) {
        await this.client.set(key, value, {
            expiration: ttl ? {
                type: "EX",
                value: ttl,
            } : "KEEPTTL",
        });
    }

    async delete(key: string) {
        this.client.del(key);
        return true;
    }

    async has(key: string) {
        return !!(await this.client.exists(key));
    }

    async clear() {
        // TODO: implement wiping redis
    }

    async connect() {
        await this.client.connect();
    }

    async quit() {
        await this.client.quit();
    }
}
