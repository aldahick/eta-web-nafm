import * as eta from "../eta";
import * as engine from "./engine/index";
import { Server } from "./Server";

export default class Client {
    private player: engine.Player;
    private server: Server;
    private socket: SocketIO.Socket & {
        handshake: {
            session: Express.Session
        }
    };

    public constructor(server: Server, socket: SocketIO.Socket & {
        handshake: {
            session: Express.Session
        }
    }) {
        this.server = server;
        this.socket = socket;
        if (socket.handshake.session.nafmServerUID === this.server.uid) {
            this.player = this.server.game.findPlayer(socket.handshake.session.nafmId);
        }
    }

    public async setup(): Promise<void> {
        this.socket.on("chat", this.onChat.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
        this.socket.on("move", this.onMove.bind(this));
        this.server.chatMessages.forEach(msg => this.socket.emit("chat", msg));
        const isNew: boolean = !this.player;
        if (this.player) {
            this.player.isHidden = false;
            this.server.sendChat("System", `${this.player.coloredName} reconnected.`, "white");
        } else {
            this.player = this.server.game.addPlayer();
            this.socket.handshake.session.nafmId = this.player.playerId;
            this.socket.handshake.session.nafmServerUID = this.server.uid;
            await eta.session.save(this.socket.handshake.session);
            this.socket.on("name", (name: string) => {
                this.player.name = name;
                this.server.sendChat("System", `${this.player.coloredName} joined.`, "white");
            });
        }
        this.socket.emit("ready", { id: this.player.id, isNew });
        this.server.sendRender();
    }

    private onChat(message: string): void {
        this.server.sendChat(this.player.name, eta._.escape(message), this.player.color);
    }

    private onDisconnect(): void {
        this.player.isHidden = true;
        this.server.sendRender();
    }

    private onMove(direction: engine.Direction): void {
        this.player.move(direction);
        this.server.sendRender();
        this.server.sendChat("System", `${this.player.coloredName} moved ${engine.Direction[direction].toLowerCase()}`, "white", true);
    }
}
