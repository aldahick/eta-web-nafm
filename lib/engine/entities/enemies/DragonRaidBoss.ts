import Enemy from "../Enemy";

export default class DragonRaidBoss extends Enemy {
    public char = "Y";
    private colorArray = ["red", "green", "blue", "dimgrey"];
    public color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    public stats = {
        health: 120,
        armor: 16,
        attack: 14
    };
    public xp = 60;
}
