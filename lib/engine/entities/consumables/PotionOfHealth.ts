import Consumable from "../Consumable";
import Player from "../../entities/Player";


export default class PotionOfHealth extends Consumable {
    public constructor(init: Partial<Consumable>){
        super(init);
        this.message = "You quaff the potion and feel your wounds fade. You gain life";
        this.char = ">";
        this.color = "#FF4D4D";
    }

    public consume(player: Player){
        player.stats.health += 3;
    }
}
