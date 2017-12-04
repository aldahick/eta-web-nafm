import * as eta from "../eta";
import * as express from "express";
import * as SocketIOServer from "socket.io";
import { Server } from "../lib/Server";
import * as lib from "../lib/index";
const SocketIOSession: (session: express.Handler, options?: {
    autoSave: boolean;
}) => any = require("express-socket.io-session");

export default class SocketIOLifecycle extends eta.ILifecycleHandler {
    public async beforeServerStart(): Promise<void> {
        const io: SocketIO.Server = SocketIOServer(this.server.server, {
            path: "/socket.io/hicks-web-nafm",
            serveClient: false
        });
        io.use(SocketIOSession(this.server.middleware.session, { autoSave: true }));
        (<any>lib).Server = new Server(io);
        eta.logger.info("NAFM server started.");
    }

    public async onServerStop(): Promise<void> {
        if (lib.Server) {
            await lib.Server.close();
            eta.logger.info("NAFM server stopped.");
        }
    }
}
