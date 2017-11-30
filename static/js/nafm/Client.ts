import * as engine from "./engine.js";

export default class ClientGame extends engine.Game {
    public constructor() {
        super();
        $(document.body).on("keypress", this.onKeyPress.bind(this));
        (<any>window).game = this;
    }

    public start(): void {
        super.start();
        this.render();
    }

    public render(): void {
        $("#canvas").html(this.level.buildRender());
    }

    private onKeyPress(evt: JQuery.Event): void {
        evt.which -= 32; // fix capital letter offset because JAVASCRIPT
        if (evt.which === JQuery.Key.ArrowUp || evt.which === JQuery.Key.W) this.player.move(engine.Direction.Up);
        if (evt.which === JQuery.Key.ArrowDown || evt.which === JQuery.Key.S) this.player.move(engine.Direction.Down);
        if (evt.which === JQuery.Key.ArrowLeft || evt.which === JQuery.Key.A) this.player.move(engine.Direction.Left);
        if (evt.which === JQuery.Key.ArrowRight || evt.which === JQuery.Key.D) this.player.move(engine.Direction.Right);
        this.render();
    }
}
