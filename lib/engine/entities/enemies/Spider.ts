import Enemy from "../Enemy";

export default class Spider extends Enemy {
    public char = "x";
    public color = "red";
    public stats = {
        health: 8,
        armor: 0,
        attack: 2
    }
    public xp = 4;
}
