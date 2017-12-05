import * as eta from "../eta";
import * as engine from "./engine";
import * as generateMaze from "generate-maze";
import * as session from "express-session";
import ChatMessage from "./ChatMessage";
import Client from "./Client";

let instance: Server;

export class Server {
    public chatMessages: ChatMessage[] = [];
    public game: engine.Game;
    public io: SocketIO.Server;

    public constructor(io: SocketIO.Server) {
        instance = this;
        this.game = new engine.Game();
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
        const maze = generateMaze(this.game.level.size.x / 2 - 1, this.game.level.size.y / 2 - 1);
        const walls: engine.Vector2[] = [];
        for (const row of maze) {
            for (const cell of row) {
                const base = new engine.Vector2(cell.x * 2 + 1, cell.y * 2 + 1);
                if (cell.top) walls.push(base.add(new engine.Vector2(0, -1)));
                if (cell.bottom) walls.push(base.add(new engine.Vector2(0, 1)));
                if (cell.left) walls.push(base.add(new engine.Vector2(-1, 0)));
                if (cell.right) walls.push(base.add(new engine.Vector2(1, 0)));
            }
        }
        eta._.uniqBy(walls, v => v.x + "_" + v.y).forEach(position => {
            this.game.level.addEntity(new engine.Wall({ position }));
        });
    }

    public sendRender(): void {
        this.io.emit("render", this.game.level.buildRender());
    }

    public sendChat(name: string, message: string, color: string, auto = false): void {
        this.chatMessages.push({
            message, color, name, auto,
            timestamp: new Date(),
        });
        this.io.emit("chat", this.chatMessages[this.chatMessages.length - 1]);
        this.chatMessages = this.chatMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
}

export default instance;
