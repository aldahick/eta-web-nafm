import Enemy from "../Enemy";

export default class Orc extends Enemy {
    public char = "o";
    public color = "olivedrab";
    public stats = {
        health: 24,
        armor: 5,
        attack: 9
    }
    public xp = 19;
}
