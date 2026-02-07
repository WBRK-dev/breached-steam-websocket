import type { WebSocket } from "ws";
import LaravelService from "../../../Services/LaravelService.js";
import type { UserStatus } from "../../../Types/App.js";
import Context from "../../../Facades/Context.js";
import type { CacheDriver } from "../../../Drivers/Cache/index.js";
import StatusService from "../../../Services/StatusService.js";

type Data = {
    access_token: string,
    bs_version: string,
    startup_status?: UserStatus,
}

export default async function (ws: WebSocket, data: Data) {
    ws.accessToken = data.access_token;
    ws.bsVersion = data.bs_version;

    try {
        const response = await LaravelService.access(data.access_token, data.bs_version);

        if (!response) return;

        ws.authenticated = true;
        ws.userId = response.user_id;

        ws.send(JSON.stringify({
            a: "Authenticate",
        }));

        const cache = Context.get<CacheDriver>('cache')!;
        const status = data.startup_status || "online";
        cache.set(`user.${ws.userId}.status`, status);

        if (status !== "away")
            StatusService.broadcastStatus(ws, status);

        StatusService.sendAllFriendStatusses(ws);
    } catch { }
}
