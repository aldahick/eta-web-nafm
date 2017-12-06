import Enemy from "../Enemy";

export default class Skeleton extends Enemy {
    public char = "$";
    public color = "lightgrey";
    public stats = {
        health: 24,
        armor: 0,
        attack: 10
    }
    public xp = 19;
}
