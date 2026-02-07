import type { CacheDriver } from "./index.js";

export default class Memory implements CacheDriver {
    private storage: Record<string, any> = {};

    get(key: string) {
        return this.storage[key];
    }

    async set(key: string, value: any) {
        this.storage[key] = value;
    }

    async delete(key: string) {
        delete this.storage[key];
        return true;
    }

    async has(key: string) {
        return !!this.storage[key];
    }

    async clear() {
        this.storage = {};
    }
}
