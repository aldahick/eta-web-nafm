import Enemy from "../Enemy";

export default class Boar extends Enemy {
    public char = "!";
    public color = "brown";
    public stats = {
        health: 16,
        armor: 5,
        attack: 5
    }
    public xp = 14;
}
