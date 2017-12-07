import * as eta from "../../../eta";
import * as fs from "fs-extra";
import Direction from "../Direction";
import Entity from "../Entity";
import Player from "./Player";
import Vector2 from "../Vector2";

export default class Enemy extends Entity {
    public static definitions: {[key: string]: Partial<Enemy>} = {};
    public char = "$";
    public color = "red";
    public get isTracking(): boolean { return this.target !== undefined; }
    public get target(): Entity { return this._target; }
    public set target(target: Entity) {
        this._target = target;
        this.target.on("killed", () => {
            this._target = undefined;
        });
    }
    private _target: Entity;

    public constructor(init: Partial<Entity>) {
        super(init);
        Object.assign(this, init);
        this.on("combat-defend", (player: Player) => {
            this.target = player;
            this.attack(this.target);
        });
    }

    public update(): void {
        if (!this.isTracking) {
            const min = this.position.sub(5);
            const max = this.position.add(5);
            const targets = this.level.entities.filter(e => e instanceof Player && e.position.getLinearDistance(this.position) < 4);
            if (targets.length === 0) return;
            this.target = targets.sort((a, b) => this.position.getLinearDistance(a.position) - this.position.getLinearDistance(b.position))[0];
        }
        if (this.position.getAdjacentCardinalPoints().find(v => v.equals(this.target.position)) !== undefined) {
            // adjacent to target
            this.attack(this.target);
            return; // no need to continue
        }
        const path: Vector2[] = this.findPathToTarget();
        if (path === undefined) {
            eta.logger.warn("No path found!");
            return;
        }
        this.move(this.position.getDirectionTo(path[0]));
    }

    public findPathToTarget(): Vector2[] {
        const queue: Node[] = [{
            position: this.position,
            parent: undefined,
            hasVisited: false
        }];
        const searched: string[] = [];
        while (queue.length > 0) {
            const item = queue.splice(0, 1)[0];
            item.hasVisited = true;
            const neighbors: Node[] = item.position.getAdjacentCardinalPoints().map(neighborPosition => {
                if (this.level.entities.find(e => e.position.equals(neighborPosition) && !(e instanceof Player)) !== undefined) return undefined;
                return {
                    parent: item,
                    position: neighborPosition,
                    hasVisited: false
                };
            }).filter(i => i !== undefined);
            for (const neighbor of neighbors) {
                if (neighbor.position.equals(this.target.position)) {
                    const path: Vector2[] = [];
                    let iteratee: Node = neighbor;
                    while (iteratee.parent !== undefined) {
                        path.push(iteratee.position);
                        iteratee = iteratee.parent;
                    }
                    return path.reverse();
                }
                queue.push(neighbor);
            }
        }
        return undefined;
    }

    public static create(name: string, _init: Partial<Entity>): Enemy {
        if (!this.definitions[name]) {
            eta.logger.warn("Enemy definition " + name + " could not be found.");
            return undefined;
        }
        const init: any = eta._.extend(this.definitions[name], _init);
        if (init.color instanceof Array) {
            init.color = init.color[eta._.random(0, init.color.length)];
        }
        return new Enemy(init);
    }

    public static async load(): Promise<void> {
        const filenames: string[] = await eta.fs.recursiveReaddir(__dirname + "/enemies");
        for (const filename of filenames) {
            const name: string = filename.replace(/\\/g, "/").split("/").slice(-1)[0].split(".").slice(0, -1).join(".");
            const definition = await fs.readJSON(filename);
            this.definitions[name] = definition;
        }
    }
}

interface Node {
    parent: Node;
    position: Vector2;
    hasVisited: boolean;
}
