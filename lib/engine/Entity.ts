import Level from "./Level";
import Vector2 from "./Vector2";

export default class Entity {
    private static lastId = -1;
    public id: number;
    public isHidden = false;
    public level: Level;
    public position: Vector2;
    public char: string;
    public color: string;

    public constructor(init: Partial<Entity>) {
        Object.assign(this, init);
        this.id = ++Entity.lastId;
    }

    public checkBoundaries(): boolean {
        const colliding = {
            x: this.checkBoundariesPart("x"),
            y: this.checkBoundariesPart("y")
        };
        return colliding.x || colliding.y || this.level.entities
            .find(e => e instanceof Wall && e.position.equals(this.position)) !== undefined;
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
