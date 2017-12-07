import Direction from "../Direction";
import Enemy from "./Enemy";
import Entity from "../Entity";
import EntityStats from "../EntityStats";
import Vector2 from "../Vector2";

export default class Player extends Entity {
    public static readonly MOVES_PER_TURN = 2;
    private static lastPlayerId = 0;
    public playerId = ++Player.lastPlayerId;
    public char = "@";
    public flags: {[key: string]: any} = {};
    private _stats: EntityStats;
    public set stats(stats: EntityStats) {
        this._stats = stats;
    }
    public get stats(): EntityStats {
        return {
            health: this._stats.health + (this.xpLevel * 8),
            maxHealth: this._stats.maxHealth,
            xp: this._stats.xp,
            armor: this._stats.armor + this.xpLevel,
            attack: this._stats.attack + (this.xpLevel * 2)
        };
    }
    public get xpLevel(): number {
        return Math.floor(this._stats.xp / 30);
    }

    public constructor(init: Partial<Entity>) {
        super(init);
        this._stats = {
            health: 10,
            maxHealth: 10,
            armor: 4,
            attack: 4,
            xp: 0
        };
    }

    public move(direction: Direction): {
        result: boolean;
        desiredPosition: Vector2;
    } {
        const result = super.move(direction);
        if (!result.result) {
            const enemy = this.level.getEntityAt(result.desiredPosition);
            if (!enemy) return result;
            this.attack(enemy);
            return result;
        }
        this.level.entities.filter(e => e instanceof Enemy).forEach((e: Enemy) => e.update());
        const consumable = this.level.getEntityAt(this.position);
        if (consumable) consumable.emit("consume", this);
        return result;
    }

    public getStats(): string {
        let healthColor = "green";
        if (this.stats.health <= 6) healthColor = "yellow";
        if (this.stats.health <= 3) healthColor = "red";
        return `<span style="font-weight: bold;">${this.coloredName}</span>
HP: <span style="color: ${healthColor}">${this.stats.health}</span> / ${this.stats.maxHealth};
AP: ${this.stats.attack};
AC: ${this.stats.armor};
XP: ${this.stats.xp};
Level: ${this.xpLevel + 1}`.replace(/\n/g, " ");
    }
}
