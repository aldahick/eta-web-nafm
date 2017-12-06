import * as eta from "../../../eta";
import Room from "./Room";
import Vector2 from "../Vector2";
import Wall from "../entities/Wall";

interface Tree {
    leaf: Room;
    right: Tree;
    left: Tree;
}

export default class LevelGenerator {
    public walls: Wall[] = [];
    public generateRooms(size: Vector2, iterations: number): Wall[] {
        const map: Room = {
            position: new Vector2(0, 0),
            size: size.clone(),
            isVertical: false,
            doorCoord: undefined
        };
        const tree: Tree = this.buildTree(map, iterations);
        this.generateEntities(tree);
        this.addBoundaries(map);
        return this.walls;
    }

    private buildTree(container: Room, iterator: number): Tree {
        const root: Tree = {
            leaf: container,
            left: undefined,
            right: undefined
        };
        if (iterator !== 0) {
            const children: Room[] = this.randomSplit(container);
            root.left = this.buildTree(children[0], iterator - 1);
            root.right = this.buildTree(children[1], iterator - 1);
        }
        return root;
    }

    private randomSplit(room: Room): Room[] {
        let roomA: Room;
        let roomB: Room;
        if (Math.random() > 0.5) { // vertical
            roomA = {
                position: room.position.clone(),
                size: new Vector2(Math.round(this.getPoint(room.size.x, room.doorCoord)), room.size.y),
                isVertical: true,
                doorCoord: undefined
            };
            roomB = {
                position: new Vector2(room.position.x + roomA.size.x, room.position.y),
                size: new Vector2(room.size.x - roomA.size.x, room.size.y),
                isVertical: true,
                doorCoord: eta._.random(Math.round(roomA.size.y / 3), Math.round(2 * roomA.size.y / 3))
            };
        } else { // horizontal
            roomA = {
                position: room.position.clone(),
                size: new Vector2(room.size.x, Math.round(this.getPoint(room.size.y, room.doorCoord))),
                isVertical: false,
                doorCoord: undefined
            };
            roomB = {
                position: new Vector2(room.position.x, room.position.y + roomA.size.y),
                size: new Vector2(room.size.x, room.size.y - roomA.size.y),
                isVertical: false,
                doorCoord: eta._.random(Math.round(roomA.size.x / 3), Math.round(2 * roomA.size.x / 3))
            };
        }
        return [roomA, roomB];
    }

    private generateEntities(tree: Tree): void {
        this.walls = this.walls.concat(eta._.range(0, tree.leaf.size.x).map(i =>
            new Wall({ position: new Vector2(tree.leaf.position.x + i, tree.leaf.position.y) })
        )).concat(eta._.range(0, tree.leaf.size.y).map(i =>
            new Wall({ position: new Vector2(tree.leaf.position.x, tree.leaf.position.y + i) })
        ));
        if (tree.right) this.generateEntities(tree.right);
        if (tree.left) this.generateEntities(tree.left);
    }

    private addBoundaries(map: Room) {
        this.walls = this.walls.concat(eta._.range(0, map.size.y).map(i =>
            new Wall({ position: new Vector2(map.size.x - 1, i) })
        )).concat(eta._.range(0, map.size.x).map(i =>
            new Wall({ position: new Vector2(i, map.size.y - 1) })
        ));
    }

    private getPoint(limiter: number, check: number): number {
        let coord: number;
        do {
            coord = eta._.random(limiter / 3, 2 * limiter / 3);
        } while (coord === check);
        return coord;
    }
}
