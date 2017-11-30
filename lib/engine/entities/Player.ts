import Direction from "../Direction";
import Entity from "../Entity";

export default class Player extends Entity {
    public char = "@";
    public color = "lightgreen";

    public move(direction: Direction): void {
        if (direction === Direction.Up) this.position.y--;
        else if (direction === Direction.Down) this.position.y++;
        else if (direction === Direction.Left) this.position.x--;
        else if (direction === Direction.Right) this.position.x++;
        console.log(this.checkBoundaries());
    }
}
