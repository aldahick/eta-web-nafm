import * as engine from "./engine";
import * as generateMaze from "generate-maze";
import * as _ from "lodash";

export default class Server {
    public constructor() {
        const level = new engine.Level();
        const maze = generateMaze(level.size.x / 2 - 1, level.size.y / 2 - 1);
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
        _.uniqBy(walls, v => v.x + "_" + v.y).forEach(v => {
            level.addEntity(new engine.Wall({
                position: v
            }));
        });
        console.log(level.buildRender());
    }
}
