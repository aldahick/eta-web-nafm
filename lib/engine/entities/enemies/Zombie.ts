import Enemy from "../Enemy";

export default class Zombie extends Enemy {
    public char = "z";
    public color = "mediumaquamarine";
    public stats = {
        health: 24,
        armor: 0,
        attack: 10
    }
    public xp = 19;
}
