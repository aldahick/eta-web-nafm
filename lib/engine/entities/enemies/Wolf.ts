import Enemy from "../Enemy";

export default class Wolf extends Enemy {
    public char = "w";
    public color = "grey";
    public stats = {
        health: 16,
        armor: 0,
        attack: 6
    };
    public xp = 14;
}
