import type { WebSocket } from "ws";
import type { Server } from "../Types/WebSocket.js";
import type { User } from "../Types/Laravel.js";
import type { UserStatus } from "../Types/App.js";
import type { CacheDriver } from "../Drivers/Cache/index.js";
import Context from "../Facades/Context.js"
import LaravelService from "./LaravelService.js";

async function broadcastStatus(ws: WebSocket, status: UserStatus) {
    const wss = Context.get<Server>('wss')!;
    const friends = await getFriends(ws);
    if (!friends) return;

    wss.clients.forEach(client => {
        if (!friends.some(c => c.id === client.userId)) return;

        client.send(JSON.stringify({
            c: "SetFriendStatus",
            data: {
                userId: ws.userId,
                status,
            },
        }));
    });
}

async function broadcastPlayingGame(ws: WebSocket, id: string, title: string) {
    const wss = Context.get<Server>('wss')!;
    const friends = await getFriends(ws);
    if (!friends) return;

    wss.clients.forEach(client => {
        if (!friends.some(c => c.id === client.userId)) return;

        client.send(JSON.stringify({
            c: "SetFriendPlayingGame",
            data: {
                userId: ws.userId,
                id,
                title,
            }
        }));
    });
}

async function broadcastQuitPlayingGame(ws: WebSocket, id: string) {
    const wss = Context.get<Server>('wss')!;
    const friends = await getFriends(ws);
    if (!friends) return;

    wss.clients.forEach(client => {
        if (!friends.some(c => c.id === client.userId)) return;

        client.send(JSON.stringify({
            c: "FriendQuitPlayingGame",
            data: {
                userId: ws.userId,
                id,
            }
        }));
    });
}

async function sendAllFriendStatusses(ws: WebSocket) {
    const friends = await getFriends(ws);
    if (!friends) return;

    const cache = Context.get<CacheDriver>('cache')!;

    friends.forEach(async friend => {
        const status = await cache.get(`user.${friend.id}.status`);
        if (status !== "online") return;
        ws.send(JSON.stringify({
            c: "SetFriendStatus",
            data: {
                userId: friend.id,
                status,
            }
        }));

        const gameId = await cache.get(`user.${friend.id}.game.id`);
        const gameTitle = await cache.get(`user.${friend.id}.game.title`);
        if (gameId && gameTitle)
            ws.send(JSON.stringify({
                c: "SetFriendPlayingGame",
                data: {
                    userId: friend.id,
                    id: gameId,
                    title: gameTitle,
                }
            }));
    });
}

export default {
    broadcastStatus,
    broadcastPlayingGame,
    broadcastQuitPlayingGame,
    sendAllFriendStatusses,
}

async function getFriends(ws: WebSocket) {
    const cacheUsers = Context.get<User[]>(`user.${ws.userId}.friends`);
    if (cacheUsers) return cacheUsers;

    const response = await LaravelService.getUserFriends(ws.accessToken, ws.bsVersion);

    if (response)
        Context.set(`user.${ws.userId}.friends`, response, 60 * 24);

    return response;
}
