import Entity from "./Entity";
import EventEmitter from "./EventEmitter";
import Level from "./Level";
import Player from "./entities/Player";
import Vector2 from "./Vector2";
const randomColor: (options?: {
    count?: number;
    hue?: string;
    luminosity?: string;
    format?: string;
    alpha?: number;
}) => string = require("randomcolor");

export default class Game {
    public level: Level;
    public constructor() {
        this.level = new Level();
    }

    public get players(): Player[] {
        return <Player[]>this.level.entities.filter(e => e instanceof Player);
    }

    public start(): void { }

    public addPlayer(): Player {
        const player = new Player({
            position: new Vector2(8, 4),
            color: randomColor({
                luminosity: "bright"
            })
        });
        this.level.addEntity(player);
        return player;
    }

    public removePlayer(player: Player): void {
        const index: number = this.level.entities.findIndex(e => e.id === player.id);
        if (index !== -1) this.level.entities.splice(index, 1);
    }

    public findEntity(id: number): Entity {
        return this.level.entities.find(e => e.id === id);
    }
}
