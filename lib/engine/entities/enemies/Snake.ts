import Enemy from "../Enemy";

export default class Snake extends Enemy {
    public char = "s";
    public color = "yellow";
    public stats = {
        health: 12,
        armor: 5,
        attack: 3
    }
    public xp = 9;
}
