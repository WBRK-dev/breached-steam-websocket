import type { WebSocket } from "ws";
import type { UserStatus } from "../../../Types/App.js";
import type { CacheDriver } from "../../../Drivers/Cache/index.js";
import Context from "../../../Facades/Context.js";
import StatusService from "../../../Services/StatusService.js";

type Data = {
    id: string,
    title: string,
}

export default async function (ws: WebSocket, data: Data) {
    if (!ws.authenticated) return;

    const cache = Context.get<CacheDriver>('cache')!;
    cache.set(`user.${ws.userId}.game.id`, data.id);
    cache.set(`user.${ws.userId}.game.title`, data.title);
    StatusService.broadcastPlayingGame(ws, data.id, data.title);
}
