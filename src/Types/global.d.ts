declare global {
    namespace NodeJS {
        interface Process {
            context: Record<string, any>;
            contextTimeouts: Record<string, Timeout>;
        }
    }
}

declare module "ws" {
    interface WebSocket {
        isAlive: boolean;
        userId: number;
        accessToken: string;
        authenticated: boolean;
        bsVersion: string;
    }
}

export {};
