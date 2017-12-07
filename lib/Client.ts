import * as eta from "../eta";
import * as engine from "./engine/index";
import { Server } from "./Server";

export default class Client {
    public player: engine.Player;
    private hasReset = false;
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
        const isNew: boolean = !(this.player && this.player.name);
        if (this.player) {
            this.player.isHidden = false;
            this.server.sendChat("System", `${this.player.coloredName} reconnected.`, "white");
        } else {
            this.player = this.server.game.addPlayer();
            this.socket.handshake.session.nafmId = this.player.playerId;
            this.socket.handshake.session.nafmServerUID = this.server.uid;
            await eta.session.save(this.socket.handshake.session);
            this.socket.on("name", (name: string) => {
                this.player.name = name || "Unknown Player";
                this.server.sendChat("System", `${this.player.coloredName} ${this.hasReset ? "respawned" : "joined"}.`, "white");
                this.server.sendRender();
            });
        }
        this.player.on("consumed", (item: engine.Consumable) => {
            this.server.sendChat("System", item.message, "white");
        });
        this.player.on("combat-attack", (e1, e2) => this.onCombat(e1, e2));
        this.player.on("combat-defend", (e1, e2) => this.onCombat(e2, e1));
        this.player.on("killed", (killer: engine.Entity) => {
            this.server.sendChat("System", `${(killer instanceof engine.Player) ? killer.coloredName : killer.char} killed ${this.player.coloredName}.`, "white");
            this.reset().catch(err => eta.logger.error(err));
        });
        this.socket.emit("ready", { id: this.player.id, isNew });
        this.server.sendRender();
    }

    public sendChat(name: string, message: string, color: string, auto = false): void {
        this.socket.emit("chat", this.server.buildChatMessage(name, message, color, auto));
    }

    public async reset(): Promise<void> {
        this.hasReset = true;
        this.socket.removeAllListeners();
        this.socket.emit("reset");
        this.socket.handshake.session.nafmId = undefined;
        this.player = undefined;
        await eta.session.save(this.socket.handshake.session);
        await this.setup();
    }

    private onChat(message: string): void {
        this.server.sendChat(this.player.name, eta._.escape(message), this.player.color);
    }

    private onDisconnect(): void {
        this.player.isHidden = true;
        this.server.sendRender();
    }

    private onCombat(attacker: engine.Entity, defender: engine.Entity) {
        const attackerName = (attacker instanceof engine.Player) ? attacker.coloredName : attacker.char;
        const defenderName = (defender instanceof engine.Player) ? defender.coloredName : defender.char;
        this.server.sendChat("System", `${attackerName} hit ${defenderName} for ${attacker.stats.attack}. (${defender.stats.health} HP left)`, "white");
    }

    private onMove(direction: engine.Direction): void {
        if (!this.player.move(direction)) return;
        this.server.sendRender();
        if (this.player === undefined) return;
        this.server.sendChat("System", `${this.player.coloredName} moved ${engine.Direction[direction].toLowerCase()}.`, "white", true);
    }
}
