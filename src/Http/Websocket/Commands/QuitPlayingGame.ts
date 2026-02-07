import type { WebSocket } from "ws";
import type { CacheDriver } from "../../../Drivers/Cache/index.js";
import Context from "../../../Facades/Context.js";
import StatusService from "../../../Services/StatusService.js";

type Data = {
    id: string,
}

export default async function (ws: WebSocket, data: Data) {
    if (!ws.authenticated) return;

    StatusService.broadcastQuitPlayingGame(ws, data.id);

    const cache = Context.get<CacheDriver>('cache')!;
    if (await cache.get(`user.${ws.userId}.game.id`) === data.id) {
        cache.delete(`user.${ws.userId}.game.id`);
        cache.delete(`user.${ws.userId}.game.title`);
    }
}
