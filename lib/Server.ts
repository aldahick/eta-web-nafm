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
    public game: engine.Game;
    public io: SocketIO.Server;

    public constructor(io: SocketIO.Server) {
        instance = this;
        this.uid = eta.crypto.generateSalt();
        this.game = new engine.Game();
        this.generateMap();
        this.io = io;
        this.io.on("connection", socket => this.onConnect(<any>socket).catch(err => eta.logger.error(err)));
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
        await client.setup();
    }

    private generateMap(): void {
        const generator = new engine.LevelGenerator();
        generator.generateRooms(new engine.Vector2(200, 50), 5)
            .forEach(wall => this.game.level.addEntity(wall));
    }

    public sendRender(): void {
        this.io.emit("render", this.game.level.buildRender());
    }

    public sendChat(name: string, message: string, color: string, auto = false): void {
        this.chatMessages.push({
            message, color, name, auto,
            timestamp: new Date(),
        });
        if (!auto) eta.logger.trace(`<${name}> ${message}`);
        this.io.emit("chat", this.chatMessages[this.chatMessages.length - 1]);
        this.chatMessages = this.chatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
}

export default instance;
