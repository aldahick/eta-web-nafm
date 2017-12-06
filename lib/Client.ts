import * as eta from "../eta";
import * as engine from "./engine/index";
import { Server } from "./Server";

export default class Client {
    public player: engine.Player;
    private server: Server;
    public socket: SocketIO.Socket & {
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
                this.server.sendRender();
            });
        }
        this.player.on("combat-attack", (target: engine.Entity) => {
            this.server.sendChat("System", `${this.player.coloredName} hit ${target.char} for ${this.player.stats.attack}. (${target.stats.health} HP left)`, "white");
        });
        this.player.on("combat-defend", (against: engine.Entity) => {
            this.server.sendChat("System", `${against.char} hit ${this.player.coloredName} for ${against.stats.attack}. (${this.player.stats.health} HP left)`, "white");
        });
        this.player.on("killed", (killer: engine.Entity) => {
            this.server.sendChat("System", `${killer.char} killed ${this.player.coloredName}.`, "white");
            this.sendChat("System", "You have been disconnected from the server because you died.", "red");
            this.socket.emit("killed");
            this.socket.disconnect();
        });
        this.socket.emit("ready", { id: this.player.id, isNew });
        this.server.sendRender();
    }

    public sendChat(name: string, message: string, color: string, auto = false): void {
        if (this.player.isHidden) return;
        this.socket.emit("chat", this.server.buildChatMessage(name, message, color, auto));
    }

    private onChat(message: string): void {
        if (this.player.isHidden) return;
        this.server.sendChat(this.player.name, eta._.escape(message), this.player.color);
    }

    private onDisconnect(): void {
        this.player.isHidden = true;
        this.server.sendRender();
    }

    private onMove(direction: engine.Direction): void {
        if (this.player.isHidden) return;
        if (!this.player.move(direction)) return;
        this.server.sendRender();
        this.server.sendChat("System", `${this.player.coloredName} moved ${engine.Direction[direction].toLowerCase()}.`, "white", true);
        if (this.player.movesLeft <= 0) {
            this.player.inTurn = false;
            this.onTurnEnd();
        }
    }

    private onTurnEnd(): void {
        if (this.player.isHidden) return;
        const index = this.server.game.level.entities.findIndex(e => e.id === this.player.id);
        const newIndex = eta._.range(index + 1, this.server.game.level.entities.length).concat(eta._.range(0, index + 1)).find(i => {
            return this.server.game.level.entities[i] instanceof engine.Player;
        });
        const newPlayer = <engine.Player>this.server.game.level.entities[newIndex];
        newPlayer.inTurn = true;
        newPlayer.movesLeft = engine.Player.MOVES_PER_TURN;
        this.server.sendChat("System", `It is now ${newPlayer.coloredName}'s turn.`, "white", true);
    }
}
