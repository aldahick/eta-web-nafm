import Enemy from "../Enemy";

export default class Goblin extends Enemy {
    public char = "g";
    public color = "palegoldenrod";
    public stats = {
        health: 20,
        armor: 5,
        attack: 7
    };
    public xp = 17;
}
