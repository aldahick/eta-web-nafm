import Direction from "../Direction";
import Enemy from "./Enemy";
import Entity from "../Entity";
import Vector2 from "../Vector2";

export default class Player extends Entity {
    public static readonly MOVES_PER_TURN = 2;
    public static readonly HEALTH_MAX = 10;
    private static lastPlayerId = 0;
    public playerId = ++Player.lastPlayerId;
    public char = "@";
    public flags: {[key: string]: any} = {};
    public name: string;
    public stats = {
       health: Player.HEALTH_MAX,
       armor: 10,
       attack: 4
   };
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
        const consumable = this.level.getEntityAt(this.position);
        if (consumable) consumable.emit("consume", this);
        return result;
    }

    public getStats(): string {
        let healthColor = "green";
        if (this.stats.health <= 6) healthColor = "yellow";
        if (this.stats.health <= 3) healthColor = "red";
        return `<span style="font-weight: bold;">${this.coloredName}</span>
        HP: <span style="color: ${healthColor}">${this.stats.health}</span> / ${Player.HEALTH_MAX};
        AP: ${this.stats.attack};
        AC: ${this.stats.armor}`.replace(/\n/g, " ");
    }
}
