import Enemy from "../Enemy";

export default class ElementalRaidBoss extends Enemy {
    public char = "W";
    private colorArray = ["whitesmoke","redorange","aqua","sienna","slategrey"]
    public color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    public stats = {
        health: 120,
        armor: 16,
        attack: 14
    }
    public xp = 60;
}
