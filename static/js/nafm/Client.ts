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
        switch (evt.which) {
            case JQuery.Key.ArrowUp:
            case JQuery.Key.W:
                this.player.move(engine.Direction.Up);
                break;
            case JQuery.Key.ArrowDown:
            case JQuery.Key.S:
                this.player.move(engine.Direction.Down);
                break;
            case JQuery.Key.ArrowLeft:
            case JQuery.Key.A:
                this.player.move(engine.Direction.Left);
                break;
            case JQuery.Key.ArrowRight:
            case JQuery.Key.D:
                this.player.move(engine.Direction.Right);
                break;
        }
        this.render();
    }
}
