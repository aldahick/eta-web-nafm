import Enemy from "../Enemy";

export default class Bat extends Enemy {
    public char = "^";
    public color = "grey";
    public stats = {
        health: 12,
        armor: 0,
        attack: 4
    };
    public xp = 9;
}
