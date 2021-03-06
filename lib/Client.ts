import * as eta from "../eta";
import * as engine from "./engine/index";
import { Server } from "./Server";

export default class Client {
    public player: engine.Player;
    private hasReset = false;
    private server: Server;
    private color: string;
    public socket: SocketIO.Socket;

    public constructor(server: Server, socket: SocketIO.Socket) {
        this.server = server;
        this.socket = socket;
    }

    public async setup(): Promise<void> {
        this.socket.on("chat", this.onChat.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));
        this.socket.on("move", this.onMove.bind(this));
        if (!this.hasReset) {
            this.server.chatMessages.forEach(msg => this.socket.emit("chat", msg));
        }
        this.player = this.server.game.addPlayer();
        if (this.color) this.player.color = this.color;
        else this.color = this.player.color;
        this.socket.on("name", (name: string) => {
            this.player.name = name || "Unknown Player";
            this.server.sendChat("System", `${this.player.coloredName} ${this.hasReset ? "respawned" : "joined"}.`, "white");
            this.server.sendRender();
        });
        this.player.on("consumed", (item: engine.Consumable) => {
            this.server.sendChat("System", item.message, "white");
        });
        this.player.on("combat-attack", (e1, e2) => this.onCombat(e1, e2));
        this.player.on("combat-defend", (e1, e2) => this.onCombat(e2, e1));
        this.player.on("killed", (killer: engine.Entity) => {
            this.server.sendChat("System", `${killer.coloredName} killed ${this.player.coloredName}.`, "white");
            this.reset().catch(err => eta.logger.error(err));
        });
        this.socket.emit("ready", { id: this.player.id });
        this.server.sendRender();
    }

    public sendChat(name: string, message: string, color: string, auto = false): void {
        this.socket.emit("chat", this.server.buildChatMessage(name, message, color, auto));
    }

    public async reset(): Promise<void> {
        this.hasReset = true;
        this.socket.removeAllListeners();
        this.socket.emit("reset");
        this.player = undefined;
        await this.setup();
    }

    private onChat(message: string): void {
        if (message.startsWith("/which ")) {
            const char = message.split(" ")[1];
            const name = Object.keys(engine.Enemy.definitions)
                .find(k => engine.Enemy.definitions[k].char === char);
            const response = name === undefined ? `I'm not sure what the "${char}" represents.` : `The "${char}" represents a ${name}.`;
            this.sendChat("System", response, "white");
            return;
        }
        this.server.sendChat(this.player.name, eta._.escape(message), this.player.color);
    }

    private onDisconnect(): void {
        this.player.isHidden = true;
        this.server.sendRender();
    }

    private onCombat(attacker: engine.Entity, defender: engine.Entity) {
        this.server.sendChat("System", `${attacker.coloredName} hit ${defender.coloredName} for ${attacker.stats.attack}. (${defender.stats.health} HP left)`, "white");
    }

    private onMove(direction: engine.Direction): void {
        if (!this.player.move(direction)) return;
        this.server.sendRender();
        if (this.player === undefined) return;
        this.server.sendChat("System", `${this.player.coloredName} moved ${engine.Direction[direction].toLowerCase()}.`, "white", true);
    }
}
