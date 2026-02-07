import type { WebSocket } from "ws";
import type { UserStatus } from "../../../Types/App.js";
import type { CacheDriver } from "../../../Drivers/Cache/index.js";
import Context from "../../../Facades/Context.js";
import StatusService from "../../../Services/StatusService.js";

type Data = {
    status: UserStatus,
}

export default async function (ws: WebSocket, data: Data) {
    if (!ws.authenticated) return;

    const cache = Context.get<CacheDriver>('cache')!;
    cache.set(`user.${ws.userId}.status`, data.status);
    StatusService.broadcastStatus(ws, data.status);
}
