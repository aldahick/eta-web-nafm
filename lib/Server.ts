import * as eta from "../eta";
import * as engine from "./engine";
import * as generateMaze from "generate-maze";
import * as session from "express-session";
import * as LevelGenerator from "./engine/generation/LevelGenerator.js";


let instance: Server;

export class Server {
    private game: engine.Game;
    private io: SocketIO.Server;

    public constructor(io: SocketIO.Server) {
        instance = this;
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
        const session: Express.Session = socket.handshake.session;
        let player: engine.Player = <engine.Player>this.game.findEntity(session.nafmId);
        if (player) {
            player.isHidden = false;
        } else {
            player = this.game.addPlayer();
            session.nafmId = player.id;
            await eta.session.save(session);
        }
        socket.emit("render", this.game.level.buildRender());
        socket.on("move", (direction: engine.Direction) => {
            player.move(direction);
            this.sendRender();
        });
        socket.on("disconnect", () => {
            player.isHidden = true;
            this.sendRender();
        });
    }

    private generateMap(): void {
        /*
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
        */
        let lg = new LevelGenerator.default();
        let walls: engine.Wall[] = lg.generateRooms(200, 50, 5);
        for(let i: number = 0; i < walls.length; i++){
            this.game.level.addEntity(walls[i]);
        }

    }

    private sendRender(): void {
        this.io.emit("render", this.game.level.buildRender());
    }
}

export default instance;
