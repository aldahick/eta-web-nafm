import EventEmitter from "./EventEmitter";
import Level from "./Level";
import Player from "./entities/Player";
import Vector2 from "./Vector2";

export default class Game {
    public level: Level;
    public player: Player;

    public constructor() {
        this.player = new Player({
            position: new Vector2(8, 4)
        });
        this.level = new Level();
        this.level.entities.push(this.player);
    }

    public start(): void { }
}
