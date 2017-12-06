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

    public get name(): string {
        return "Player " + this.player.id;
    }

    public get coloredName(): string {
        return `<span style="color: ${this.player.color};">${this.name}</span>`;
    }

    public constructor(server: Server, socket: SocketIO.Socket & {
        handshake: {
            session: Express.Session
        }
    }) {
        this.server = server;
        this.socket = socket;
        this.player = <engine.Player>this.server.game.findEntity(socket.handshake.session.nafmId);
    }

    public async setup(): Promise<void> {
        const isNew: boolean = !this.player;
        if (this.player) {
            this.player.isHidden = false;
        } else {
            this.player = this.server.game.addPlayer();
            this.socket.handshake.session.nafmId = this.player.id;
            await eta.session.save(this.socket.handshake.session);
        }
        this.socket.on("chat", this.onChat.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
        this.socket.on("move", this.onMove.bind(this));
        this.server.chatMessages.forEach(msg => this.socket.emit("chat", msg));
        this.server.sendRender();
        if (isNew) {
            this.server.sendChat("System", `${this.coloredName} joined.`, "white");
        } else {
            this.server.sendChat("System", `${this.coloredName} reconnected.`, "white");
        }
    }

    private onChat(message: string): void {
        this.server.sendChat("Player " + this.player.id, eta._.escape(message), this.player.color);
    }

    private onDisconnect(): void {
        this.player.isHidden = true;
        this.server.sendRender();
    }

    private onMove(direction: engine.Direction): void {
        this.player.move(direction);
        this.server.sendRender();
        this.server.sendChat("System", `${this.coloredName} moved ${engine.Direction[direction].toLowerCase()}`, "white", true);
    }
}
