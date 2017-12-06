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
    public stats = {
        health: 10,
        maxHealth: 10,
        armor: 2,
        attack: 4
    };
    public movesLeft = 0;
    public inTurn = false;

    public get coloredName(): string {
        return `<span style="color: ${this.color};">${this.name}</span>`;
    }

    public move(direction: Direction): {
        result: boolean;
        desiredPosition: Vector2;
    } {
        if (!this.inTurn) return { result: false, desiredPosition: undefined };
        const result = super.move(direction);
        if (!result.result) {
            const enemy = this.level.getEntityAt(result.desiredPosition);
            if (!enemy) return result;
            this.attack(enemy);
            return result;
        }
        this.level.entities.filter(e => e instanceof Enemy).forEach((e: Enemy) => e.update());
        this.movesLeft--;
        return result;
    }

    public getStats(): string {
        let healthColor = "green";
        if (this.stats.health <= 6) healthColor = "yellow";
        if (this.stats.health <= 3) healthColor = "red";
        return `<span style="font-weight: bold;">${this.coloredName}</span>
HP: <span style="color: ${healthColor}">${this.stats.health}</span> / ${this.stats.maxHealth};
AP: ${this.stats.attack};
AC: ${this.stats.armor}`.replace(/\n/g, " ");
    }
}
