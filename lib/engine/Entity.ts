import * as events from "events";
import Level from "./Level";
import Vector2 from "./Vector2";

export default class Entity extends events.EventEmitter {
    private static lastId = 0;
    public id: number;
    public isHidden = false;
    public level: Level;
    public position: Vector2;
    public char: string;
    public color = "white";

    public constructor(init: Partial<Entity>) {
        super();
        Object.assign(this, init);
        this.id = ++Entity.lastId;
    }

    public checkBoundaries(): boolean {
        const colliding = {
            x: this.checkBoundariesPart("x"),
            y: this.checkBoundariesPart("y")
        };
        return colliding.x || colliding.y;
    }

    private checkBoundariesPart(component: "x" | "y"): boolean {
        if (this.position[component] < 0) {
            this.position[component] = 0;
            return true;
        } else if (this.position[component] > this.level.size[component] - 1) {
            this.position[component] = this.level.size[component] - 1;
            return true;
        }
        return false;
    }
}

import Wall from "./entities/Wall";
