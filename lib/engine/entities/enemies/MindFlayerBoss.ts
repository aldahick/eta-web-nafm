import Enemy from "../Enemy";

export default class MindFlayerBoss extends Enemy {
    public char = "M";
    public color = "mediumorchid";
    public stats = {
        health: 50,
        armor: 10,
        attack: 14
    }
    public xp = 30;
}
