import Enemy from "../Enemy";

export default class ElderRaidBoss extends Enemy {
    public char = "E";
    private colorArray = ["darkgreen","darkorange","yellowgreen","rebeccapurple"]
    public color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    public stats = {
        health: 120,
        armor: 18,
        attack: 14
    }
    public xp = 60;
}
