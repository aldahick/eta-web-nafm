import Enemy from "../Enemy";

export default class GrimReaperBoss extends Enemy {
    public char = "G";
    public color = "dimgrey";
    public stats = {
        health: 50,
        armor: 8,
        attack: 12
    };
    public xp = 30;
}
