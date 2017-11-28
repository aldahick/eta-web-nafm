import * as engine from "./engine.js";

let player: engine.Player;
let level: engine.Level;

function render(): void {
    $("#canvas").html(level.buildRender());
}

function onKeyPress(evt: JQuery.Event): void {
    evt.which -= 32; // fix capital letter offset because JAVASCRIPT
    switch (evt.which) {
        case JQuery.Key.ArrowUp:
        case JQuery.Key.W:
            player.position.y--;
            break;
        case JQuery.Key.ArrowDown:
        case JQuery.Key.S:
            player.position.y++;
            break;
        case JQuery.Key.ArrowLeft:
        case JQuery.Key.A:
            player.position.x--;
            break;
        case JQuery.Key.ArrowRight:
        case JQuery.Key.D:
            player.position.x++;
            break;
    }
    render();
}

$(document).ready(() => {
    player = new engine.Player({
        position: new engine.Vector2(8, 4)
    });
    level = new engine.Level();
    level.entities.push(player);
    render();
    $(document.body).on("keypress", onKeyPress);
});
