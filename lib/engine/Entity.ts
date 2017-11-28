import Vector2 from "./Vector2";

export default class Entity {
    public position: Vector2;
    public char: string;
    public color: string;

    public constructor(init: Partial<Entity>) {
        Object.assign(this, init);
    }
}
