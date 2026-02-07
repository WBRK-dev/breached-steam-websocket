function get<T>(key: string): T | undefined {
    return process.context?.[key];
}

function set(key: string, value: any, ttl?: number) {
    process.context[key] = value;

    clearTimeout(process.contextTimeouts[key]);
    if (ttl)
        process.contextTimeouts[key] = setTimeout(() => {
            delete process.context[key];
        }, ttl / 60 / 1000);
}

export default {
    get,
    set,
}
