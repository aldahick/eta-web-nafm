import * as eta from "../eta";
import * as socketIO from "socket.io";
import { Server } from "../lib/Server";
import * as lib from "../lib/index";

export default class SocketIOLifecycle extends eta.ILifecycleHandler {
    public async beforeServerStart(): Promise<void> {
        const io: SocketIO.Server = socketIO(this.server.server);
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
