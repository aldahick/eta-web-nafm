import Consumable from "../Consumable";
import Player from "../../entities/Player";


export default class PotionOfMight extends Consumable {
    public constructor(init: Partial<Consumable>) {
        super(init);
        this.message = "You quaff the potion and grow stronger! Your attacks hit harder";
        this.char = ">";
        this.color = "#1AFF1A";
    }

<<<<<<< HEAD
    public consume(player: Player){
        player.stats.attack += 2;
=======
    public consume(player: Player) {
        player.stats.attack += 3;
>>>>>>> origin/master
    }
}
