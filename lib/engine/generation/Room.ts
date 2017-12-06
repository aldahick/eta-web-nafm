import Vector2 from "../Vector2";

export default interface Room {
    position: Vector2;
    size: Vector2;
    door: Vector2;
}
