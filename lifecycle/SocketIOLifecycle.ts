import * as eta from "../eta";
import * as express from "express";
import * as SocketIOServer from "socket.io";
import WebServer from "../../../server/WebServer";
import { Server } from "../lib/Server";
import * as lib from "../lib/index";

export default class SocketIOLifecycle extends eta.ILifecycleHandler {
    public register(server: WebServer): void {
        server.on("pre-server-start", () => this.preServerStart(server));
        server.on("server-stop", this.onServerStop.bind(this));
    }

    public async preServerStart(server: WebServer): Promise<void> {
        const io: SocketIO.Server = SocketIOServer(server.server, {
            path: "/socket.io/hicks-web-nafm",
            serveClient: false
        });
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
