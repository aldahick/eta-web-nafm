import * as events from "events";
import Entity from "./Entity";
import Player from "./entities/Player";
import Vector2 from "./Vector2";
import * as _ from "lodash";
import * as eta from "../../eta";

export default class Level extends events.EventEmitter {
    public size: Vector2 = new Vector2(200, 50);
    public entities: Entity[] = [];

    public get players(): Player[] {
        return <Player[]>this.entities.filter(e => e instanceof Player);
    }

    public getEntityAt(position: Vector2): Entity {
        return this.entities.find(e => e.position.equals(position));
    }

    public addEntity(entity: Entity): void {
        entity.level = this;
        this.entities.push(entity);
        this.emit("entity-add", entity);
    }

    public removeEntity(id: number): void {
        const index = this.entities.findIndex(e => e.id === id);
        if (index === -1) return;
        this.entities.splice(index, 1);
    }

    public buildRender(): string[][] {
        const rows: string[][] = new Array(this.size.y).fill(0).map(r => new Array(this.size.x).fill("."));
        this.entities.filter(e => !e.isHidden).forEach(e => {
            let render: string = e.char;
            render = `<span id="entity-${e.id}" style="color: ${e.color};">${e.char}</span>`;
            rows[e.position.y][e.position.x] = render;
        });
        return rows;
    }
}
