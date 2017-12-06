import Entity from "../Entity";
import Player from "../entities/Player";
import Vector2 from "../Vector2";
import * as _ from "lodash";
import * as eta from "../../../eta";


export default abstract class Consumable extends Entity {
    public message: string;
    public constructor(init: Partial<Entity>) {
        super(init);
        this.on("consume", (player: Player) => {
            this.consume(player);
            player.emit("consumed", this);
            this.level.removeEntity(this.id);
        });
    }

    public abstract consume(player: Player): void;
}
