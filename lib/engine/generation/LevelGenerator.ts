import * as eta from "../../../eta";
import Room from "./Room";
import Vector2 from "../Vector2";
import Wall from "../entities/Wall";
import Enemy from "../entities/Enemy";
import PotionOfHealth from "../entities/consumables/PotionOfHealth";
import PotionOfMight from "../entities/consumables/PotionOfMight";
import PotionOfDefence from "../entities/consumables/PotionOfDefence";
interface Tree {
    leaf: Room;
    right: Tree;
    left: Tree;
}

export default class LevelGenerator {
    public walls: Wall[] = [];
    public childRooms: Room[] = [];
    private tier1Enemies: String[] = ["rat", "spider"];
    private tier2Enemies: String[] = ["bat", "snake"];
    private tier3Enemies: String[] = ["boar", "wolf"];
    private tier4Enemies: String[] = ["ghost", "goblin"];
    private tier5Enemies: String[] = ["orc", "skeleton", "zombie"];
    private bosses: String[] = ["giant", "grimreaper", "mindflayer", "rabbit"];
    private raidBosses: String[] = ["demon", "dragon", "elder", "elemental"];

    public generateRooms(size: Vector2, iterations: number): Wall[] {
        const map: Room = {
            position: new Vector2(0, 0),
            size: size.clone(),
            door: undefined
        };
        const tree: Tree = this.buildTree(map, iterations);
        this.generateEntities(tree);
        this.addBoundaries(map);
        this.fixDoors(tree);
        this.findChildren(tree);
        return this.walls;
    }

    private findChildren(tree: Tree): void {
        if(tree.left) this.findChildren(tree.left);
        if(tree.right) this.findChildren(tree.right);
        if(!tree.left && !tree.right) this.childRooms.push(tree.leaf);
    }

    private fixDoors(tree: Tree): void {
        const room: Room = tree.leaf;
        if (room.door) {
            const indicesToRemove: number[] = [];
            this.walls.forEach((w, i) => {
                if (w.position.equals(room.door)) indicesToRemove.push(i);
            });
            indicesToRemove.forEach((index, i) => {
                this.walls.splice(index - i, 1);
            });
        }
        if (tree.right) this.fixDoors(tree.right);
        if (tree.left) this.fixDoors(tree.left);
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
                size: new Vector2(Math.round(this.getPoint(room.size.x, room.door ? room.door.y : undefined)), room.size.y),
                door: undefined
            };
            roomB = {
                position: new Vector2(room.position.x + roomA.size.x, room.position.y),
                size: new Vector2(room.size.x - roomA.size.x, room.size.y),
                door: new Vector2(room.position.x + roomA.size.x,
                    eta._.random(
                        Math.round((roomA.position.y + 2)),
                        Math.round((roomA.position.y + roomA.size.y - 2))
                    )
                )
            };
        } else { // horizontal
            roomA = {
                position: room.position.clone(),
                size: new Vector2(room.size.x, (this.getPoint(room.size.y, room.door ? room.door.x : undefined))),
                door: undefined
            };
            roomB = {
                position: new Vector2(room.position.x, room.position.y + roomA.size.y),
                size: new Vector2(room.size.x, room.size.y - roomA.size.y),
                door: new Vector2(
                    eta._.random(
                        Math.round(roomA.position.x + 2),
                        Math.round((roomA.position.x + roomA.size.x - 2))
                    ), room.position.y + roomA.size.y
                )
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
            coord = Math.round(eta._.random(limiter / 3, 2 * limiter / 3));
            if(check) eta.logger.trace(coord.toString() + " " + check.toString());
        } while (coord == check || coord == check+1 || coord == check-1);
        return coord;
    }
}
