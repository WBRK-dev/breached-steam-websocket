import type { CacheDriver } from "../../../Drivers/Cache/index.js";
import type { Server } from "../../../Types/WebSocket.js";
import type { WebSocket } from "ws";
import Context from "../../../Facades/Context.js";
import StatusService from "../../../Services/StatusService.js";

export default function (ws: WebSocket) {
    const cache = Context.get<CacheDriver>('cache')!;
    const wss = Context.get<Server>('wss')!;

    cache.delete(`user.${ws.userId}.status`);
    cache.delete(`user.${ws.userId}.game.id`);
    cache.delete(`user.${ws.userId}.game.title`);

    StatusService.broadcastStatus(ws, "away");

    ws.close();
    ws.terminate();
}
