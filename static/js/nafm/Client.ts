import * as engine from "./engine.js";
import io from "socket.io-client";

export default class ClientGame {
    private color: string;
    private renderedMap: string[][];
    private socket: SocketIOClient.Socket;

    public constructor() {
        $(document.body).on("keypress", this.onKeyPress.bind(this));
        (<any>window).game = this;
    }

    public start(): void {
        this.socket = io({
            path: "/socket.io/hicks-web-nafm"
        });
        this.socket.on("render", this.onRender.bind(this));
    }

    public onRender(renderedMap: string[][]): void {
        this.renderedMap = renderedMap;
        $("#canvas").html(this.renderedMap.map(r => r.join("")).join("\n"));
    }

    private onKeyPress(evt: JQuery.Event): void {
        evt.which -= 32; // fix capital letter offset because JAVASCRIPT
        let direction: engine.Direction;
        if (evt.which === JQuery.Key.ArrowUp || evt.which === JQuery.Key.W) direction = engine.Direction.Up;
        if (evt.which === JQuery.Key.ArrowDown || evt.which === JQuery.Key.S) direction = engine.Direction.Down;
        if (evt.which === JQuery.Key.ArrowLeft || evt.which === JQuery.Key.A) direction = engine.Direction.Left;
        if (evt.which === JQuery.Key.ArrowRight || evt.which === JQuery.Key.D) direction = engine.Direction.Right;
        this.socket.emit("move", direction);
    }
}
