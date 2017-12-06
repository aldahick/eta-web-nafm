import Direction from "../Direction";
import Entity from "../Entity";

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
        if (direction === Direction.Up) this.position.y--;
        else if (direction === Direction.Down) this.position.y++;
        else if (direction === Direction.Left) this.position.x--;
        else if (direction === Direction.Right) this.position.x++;
        this.checkBoundaries();
    }
}
