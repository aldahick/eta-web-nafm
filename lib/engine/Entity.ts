import * as eta from "../../eta";
import * as events from "events";
import Direction from "./Direction";
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
    public stats: {
        health: number;
        armor: number;
        attack: number;
        xp: number;
    };

    public constructor(init: Partial<Entity>) {
        super();
        Object.assign(this, init);
        this.id = ++Entity.lastId;
    }

    public attack(target: Entity): void {
        if (!target.stats) return;
        if (target instanceof Player && !(<Player>target).name) return;
        if (eta._.random(0, 20) > target.stats.armor) {
            ((<any>target)._stats || target.stats).health -= this.stats.attack;
            this.emit("combat-attack", target, this);
            target.emit("combat-defend", this, target);
            if (target.stats.health <= 0) {
                target.kill(this);
                ((<any>this)._stats || this.stats).xp += target.stats.xp;
                return;
            }
        }
        target.emit("combat", this);
    }

    public kill(killer: Entity): void {
        this.isHidden = true;
        this.level.removeEntity(this.id);
        this.emit("killed", killer);
    }

    public move(direction: Direction): {
        result: boolean;
        desiredPosition: Vector2;
    } {
        const desiredPosition: Vector2 = this.position.clone();
        if (direction === Direction.Up) desiredPosition.y--;
        else if (direction === Direction.Down) desiredPosition.y++;
        else if (direction === Direction.Left) desiredPosition.x--;
        else if (direction === Direction.Right) desiredPosition.x++;
        if (this.level.entities.find(e => e.position.equals(desiredPosition) && !(e instanceof Consumable)) !== undefined) {
            return {
                result: false,
                desiredPosition
            };
        }
        this.position = desiredPosition;
        if (this.checkBoundaries()) {
            return {
                result: false,
                desiredPosition
            };
        }
        return {
            result: true,
            desiredPosition
        };
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

import Consumable from "./entities/Consumable";
import Player from "./entities/Player";
import Wall from "./entities/Wall";
