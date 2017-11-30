import Direction from "../Direction";
import Entity from "../Entity";

export default class Player extends Entity {
    public char = "@";
    public color = "lightgreen";

    public move(direction: Direction): void {
        switch (direction) {
            case Direction.Up: return <any>this.position.y--;
            case Direction.Down: return <any>this.position.y++;
            case Direction.Left: return <any>this.position.x--;
            case Direction.Right: return <any>this.position.x++;
        }
        console.log(this.checkBoundaries(), this.position);
    }
}
