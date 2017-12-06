import Direction from "../Direction";
import Enemy from "./Enemy";
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
        const result = super.move(direction);
        this.level.entities.filter(e => e instanceof Enemy).forEach((e: Enemy) => e.update());
        if (result) this.movesLeft--;
        return result;
    }
}
