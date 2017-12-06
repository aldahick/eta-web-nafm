import Enemy from "../Enemy";

export default class Rat extends Enemy {
    public char = "r";
    public color = "grey";
    public stats = {
        health: 8,
        armor: 5,
        attack: 1
    };
    public xp = 4;
}
