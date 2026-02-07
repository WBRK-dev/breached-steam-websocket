import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { Connection, Terminate } from "./Websocket/Events/index.js";
import Context from "../Facades/Context.js";

function init() {
    const server = createServer();
    const wss = new WebSocketServer({ server });
    Context.set('wss', wss);

    wss.on('connection', Connection);

    setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                console.log("Stale connection: " + ws.userId);
                return Terminate(ws);
            }

            ws.isAlive = false;
            ws.ping();
        });
    }, 60000);

    server.listen(3000);
    console.log("Listening on 3000");
}

export default {
    init,
}
