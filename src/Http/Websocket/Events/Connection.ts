import type { Server, WebSocket } from "ws";
import Terminate from "./Terminate.js";
import path from "node:path";
import type { IncomingMessage } from "node:http";

export default function (ws: WebSocket, req: IncomingMessage) {
    console.log(`New Connection: ${req.socket.remoteAddress}`)

    ws.isAlive = true;
    ws.on('error', console.error);

    ws.on('message', runCommand);

    ws.on('close', function(data, reason) {
        console.log(`Connection closed (${req.socket.remoteAddress})`, data, reason.toString('utf-8'));
        Terminate(ws);
    });

    ws.on('pong', function () {
        ws.isAlive = true;
    });

    setTimeout(() => {
        if (!ws.authenticated)
            ws.terminate();
    }, 10000);
}

async function runCommand(this: WebSocket, data: WebSocket.RawData) {
    try {
        const json = JSON.parse(data.toString()) as { c: string, data: any };

        const commandDir = path.resolve(import.meta.dirname, '../Commands');
        const fullPath = path.resolve(commandDir, json.c + '.js');
        if (!fullPath.startsWith(commandDir + path.sep)) {
            throw new Error('Invalid command path: access denied');
        }

        const relativePath = path.relative(import.meta.dirname, fullPath);
        const module = await import('./' + relativePath);

        if (module.default && typeof module.default === 'function') {
            module.default(this, json.data);
        } else {
            console.error(`Command ${json.c} does not export a default function`);
        }
    } catch (err) {
        console.error(`Error running command: ${err}`);
        this.send(JSON.stringify({ error: 'Invalid command or data' }));
    }
}
