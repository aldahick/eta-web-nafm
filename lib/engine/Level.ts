import Entity from "./Entity";
import Vector2 from "./Vector2";
import * as _ from "lodash";
import * as eta from "../../eta";

export default class Level {
    public size: Vector2 = new Vector2(200, 50);
    public entities: Entity[] = [];

    public addEntity(entity: Entity): void {
        entity.level = this;
        this.entities.push(entity);
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
