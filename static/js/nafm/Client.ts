import io from "socket.io-client";
import moment from "moment";
import ChatMessage from "../../../lib/ChatMessage";

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
        this.socket.on("chat", this.onChat.bind(this));
    }

    public onRender(renderedMap: string[][]): void {
        this.renderedMap = renderedMap;
        $("#canvas").html(this.renderedMap.map(r => r.join("")).join("\n"));
    }

    public onChat(msg: ChatMessage): void {
        if (msg.auto && $(".nafm-flag[data-name='auto']").prop("checked") === false) return;
        const output: HTMLElement = document.getElementById("chat-output");
        const timestamp: string = moment(msg.timestamp).format("hh:mm a");
        output.innerHTML += `(${timestamp}) &lt;<span style="color: ${msg.color};">${msg.name}</span>&gt; ${msg.message}\n`;
    }

    private onKeyPress(evt: JQuery.Event): void {
        if ($(evt.target).prop("id") === "chat-input") {
            if (evt.which === 13) {
                this.socket.emit("chat", $("#chat-input").val());
                $("#chat-input").val("");
            }
            return;
        }
        evt.which -= 32; // fix capital letter offset because JAVASCRIPT
        let direction: Direction;
        if (evt.which === JQuery.Key.ArrowUp || evt.which === JQuery.Key.W) direction = Direction.Up;
        if (evt.which === JQuery.Key.ArrowDown || evt.which === JQuery.Key.S) direction = Direction.Down;
        if (evt.which === JQuery.Key.ArrowLeft || evt.which === JQuery.Key.A) direction = Direction.Left;
        if (evt.which === JQuery.Key.ArrowRight || evt.which === JQuery.Key.D) direction = Direction.Right;
        this.socket.emit("move", direction);
    }
}

enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}
