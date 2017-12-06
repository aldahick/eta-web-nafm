import Direction from "../Direction";
import Entity from "../Entity";
import Vector2 from "../Vector2";

export default class Player extends Entity {
    public static readonly MOVES_PER_TURN = 2;
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

    public move(direction: Direction): boolean {
        if (!this.inTurn) return false;
        const tempPosition: Vector2 = this.position.clone();
        if (direction === Direction.Up) tempPosition.y--;
        else if (direction === Direction.Down) tempPosition.y++;
        else if (direction === Direction.Left) tempPosition.x--;
        else if (direction === Direction.Right) tempPosition.x++;
        if (this.level.entities.find(e => e.position.equals(tempPosition)) !== undefined) return false;
        this.position = tempPosition;
        if (this.checkBoundaries()) return false;
        this.movesLeft--;
        return true;
    }
}
