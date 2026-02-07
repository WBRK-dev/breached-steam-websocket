import { LARAVEL_URL } from "../Config/App.js";
import type { User } from "../Types/Laravel.js";

async function get(path: string, headers?: Record<string, string>) {
    return await fetch(LARAVEL_URL + path, {
        headers,
    });
}

async function access(token: string, bsVersion: string) {
    return await get(`/api/access?token=${token}`, {
        'X-Breached-Steam-Version': bsVersion,
    }).then(r => {
        if (r.status !== 200)
            return null;

        return r.json();
    });
}

async function getUserFriends(token: string, bsVersion: string): Promise<User[] | null> {
    return await get(`/api/user/friends?token=${token}`, {
        'X-Breached-Steam-Version': bsVersion,
    }).then(async r => {
        if (r.status !== 200)
            return null;

        return r.json();
    });
}

export default {
    access,
    getUserFriends,
}
