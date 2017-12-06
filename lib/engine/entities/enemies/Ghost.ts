import Enemy from "../Enemy";

export default class Ghost extends Enemy {
    public char = "b";
    public color = "whitesmoke";
    public stats = {
        health: 20,
        armor: 0,
        attack: 8
    };
    public xp = 17;
}
