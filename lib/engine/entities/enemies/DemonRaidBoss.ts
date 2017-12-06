import Enemy from "../Enemy";

export default class DemonRaidBoss extends Enemy {
    public char = "D";
    private colorArray = ["red", "orchid", "blue", "pink"];
    public color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    public stats = {
        health: 120,
        armor: 16,
        attack: 14
    };
    public xp = 60;
}
