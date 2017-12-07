import * as eta from "../../../../eta";
import Consumable from "../Consumable";

export default class EndgameConsumable extends Consumable {
    public consume(): void {
        eta.logger.info("The game has ended.");
    }
}
