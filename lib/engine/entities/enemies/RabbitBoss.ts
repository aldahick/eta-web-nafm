import Enemy from "../Enemy";

export default class RabbitBoss extends Enemy {
    public char = "R";
    public color = "grey";
    public stats = {
        health: 50,
        armor: 8,
        attack: 16
    };
    public xp = 30;
}
