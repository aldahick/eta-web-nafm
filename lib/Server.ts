import * as eta from "../eta";
import * as engine from "./engine";
import * as generateMaze from "generate-maze";

let instance: Server;

export class Server {
    private game: engine.Game;
    private io: SocketIO.Server;

    public constructor(io: SocketIO.Server) {
        instance = this;
        this.io = io;
        this.io.on("connection", this.onConnect.bind(this));
    }

    public close(): void {
        this.io.close();
    }

    private onConnect(socket: SocketIO.Socket) {

    }

    private generateMap(): void {
        const maze = generateMaze(this.game.level.size.x / 2 - 1, this.game.level.size.y / 2 - 1);
        const walls: engine.Vector2[] = [];
        maze.forEach(row => {
            row.forEach(cell => {
                const base = new engine.Vector2(cell.x * 2 + 1, cell.y * 2 + 1);
                if (cell.top) walls.push(base.add(new engine.Vector2(0, -1)));
                if (cell.bottom) walls.push(base.add(new engine.Vector2(0, 1)));
                if (cell.left) walls.push(base.add(new engine.Vector2(-1, 0)));
                if (cell.right) walls.push(base.add(new engine.Vector2(1, 0)));
            });
        });
        eta._.uniqBy(walls, v => v.x + "_" + v.y).forEach(v => {
            this.game.level.addEntity(new engine.Wall({
                position: v
            }));
        });
    }
}

export default instance;
