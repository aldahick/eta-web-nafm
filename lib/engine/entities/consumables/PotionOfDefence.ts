import Consumable from "../Consumable";
import Player from "../../entities/Player";


export default class PotionOfDefence extends Consumable {
    public constructor(init: Partial<Consumable>) {
        super(init);
        this.message = "You quaff the potion and feel your skin take on the qualities of hide. Your armor grows tougher.";
        this.char = ">";
        this.color = "#6666FF";
    }

    public consume(player: Player) {
        player.stats.armor += 3;
    }
}
