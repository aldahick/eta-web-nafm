import * as eta from "../eta";
import * as engine from "./engine";
import * as generateMaze from "generate-maze";
import * as session from "express-session";
import ChatMessage from "./ChatMessage";
import Client from "./Client";

let instance: Server;

export class Server {
    public uid: string;
    public chatMessages: ChatMessage[] = [];
    public clients: Client[] = [];
    public game: engine.Game;
    public io: SocketIO.Server;

    public constructor(io: SocketIO.Server) {
        instance = this;
        this.uid = eta.crypto.generateSalt();
        this.game = new engine.Game();
        this.io = io;
        this.io.on("connection", socket => this.onConnect(<any>socket).catch(err => eta.logger.error(err)));
        engine.Enemy.load().then(() => this.generateMap())
            .catch(err => eta.logger.error(err));
    }

    public close(): void {
        this.io.close();
    }

    private async onConnect(socket: SocketIO.Socket & {
        handshake: {
            session: Express.Session
        }
    }): Promise<void> {
        const client = new Client(this, socket);
        this.clients.push(client);
        await client.setup();
    }

    private generateMap(): void {
        const generator = new engine.LevelGenerator();
        generator.generateRooms(new engine.Vector2(200, 50), 4)
            .forEach(wall => this.game.level.addEntity(wall));
        this.game.level.on("entity-add", (entity: engine.Entity) => {
            if (entity instanceof engine.Enemy) {
                entity.on("killed", (killer: engine.Player) => {
                    this.sendChat("Server", `${killer.coloredName} killed ${entity.char}.`, "white");
                });
            }
        });
        this.game.level.addEntity(engine.Enemy.create("bat", {
            position: new engine.Vector2(7, 1)
        }));
    }

    public sendRender(): void {
        this.io.emit("render", this.game.level.buildRender());
        this.clients.forEach(c => {
            if (c.socket.disconnected) return;
            if (c.player && c.player.name) c.socket.emit("stats", c.player.getStats());
        });
    }

    public sendChat(name: string, message: string, color: string, auto = false): void {
        this.chatMessages.push(this.buildChatMessage(name, message, color, auto));
        if (!auto) eta.logger.trace(`<${name}> ${message}`);
        this.io.emit("chat", this.chatMessages[this.chatMessages.length - 1]);
        this.chatMessages = this.chatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    public buildChatMessage(name: string, message: string, color: string, auto = false): ChatMessage {
        return {
            message, color, name, auto,
            timestamp: new Date(),
        };
    }
}

export default instance;
