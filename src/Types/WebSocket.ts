import type { IncomingMessage } from "node:http";
import type { Server as ServerWS, WebSocket } from "ws";

export type Server = ServerWS<typeof WebSocket, typeof IncomingMessage>;
