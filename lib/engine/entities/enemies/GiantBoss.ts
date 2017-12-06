import Enemy from "../Enemy";

export default class GiantBoss extends Enemy {
    public char = "G";
    public color = "bisque";
    public stats = {
        health: 50,
        armor: 12,
        attack: 14
    };
    public xp = 30;
}
