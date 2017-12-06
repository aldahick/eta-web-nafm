import Direction from "../Direction";
import Entity from "../Entity";
import Vector2 from "../Vector2";

export default class Player extends Entity {
    private static lastPlayerId = 0;
    public playerId = ++Player.lastPlayerId;
    public char = "@";
    public flags: {[key: string]: any} = {};
    public name: string;
    public movesLeft = 0;
    public inTurn = false;

    public get coloredName(): string {
        return `<span style="color: ${this.color};">${this.name}</span>`;
    }

    public move(direction: Direction): void {
        const tempPosition: Vector2 = this.position.clone();
        if (direction === Direction.Up) tempPosition.y--;
        else if (direction === Direction.Down) tempPosition.y++;
        else if (direction === Direction.Left) tempPosition.x--;
        else if (direction === Direction.Right) tempPosition.x++;
        if (this.level.entities.find(e => e.position.equals(tempPosition)) !== undefined) return;
        this.position = tempPosition;
        this.checkBoundaries();
    }
}
