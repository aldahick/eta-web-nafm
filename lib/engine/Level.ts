import Entity from "./Entity";
import Vector2 from "./Vector2";
import * as _ from "lodash";

export default class Level {
    public size: Vector2 = new Vector2(256, 32);
    public entities: Entity[] = [];

    public buildRender(): string {
        const rows: string[][] = new Array(this.size.y).fill(0).map(r => new Array(this.size.x).fill("."));
        this.entities.forEach(e => {
            let render: string = e.char;
            if (e.color) {
                render = `<span style="color: ${e.color};">${e.char}</span>`;
            }
            rows[e.position.y][e.position.x] = render;
        });
        return rows.map(r => r.join("")).join("\n");
    }
}
