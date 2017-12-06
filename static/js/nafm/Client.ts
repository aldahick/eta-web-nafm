import * as engine from "nafm/engine.js";
import _ from "lodash";
import io from "socket.io-client";
import moment from "moment";
import ChatMessage from "../../../lib/ChatMessage";
import HelperText from "nafm/helpers/text.js";

export default class ClientGame {
    private canvasSize: engine.Vector2;
    private entityId: number;
    private color: string;
    private socket: SocketIOClient.Socket;

    public constructor() {
        $(document.body).on("keydown", this.onKeyPress.bind(this));
        (<any>window).game = this;
        const charWidth: number = HelperText.getTextWidth("#");
        this.canvasSize = new engine.Vector2($("#canvas").width() / charWidth, $("#canvas").height() / 13).transform(Math.floor);
    }

    public start(): void {
        this.socket = io({
            path: "/socket.io/hicks-web-nafm"
        });
        this.socket.on("ready", (evt: {
            isNew: boolean;
            id: number;
        }) => {
            this.entityId = evt.id;
            if (evt.isNew) {
                this.socket.emit("name", prompt("What's your name?"));
            }
        });
        this.socket.on("render", this.onRender.bind(this));
        this.socket.on("stats", this.onStats.bind(this));
        this.socket.on("chat", this.onChat.bind(this));
    }

    public onRender(renderedMap: string[][]): void {
        (() => {
            (<any>window).renderedMap = renderedMap;
            const mapSize: engine.Vector2 = new engine.Vector2(renderedMap[0].length, renderedMap.length);
            if (mapSize.x < this.canvasSize.x && mapSize.y < this.canvasSize.y) return;
            let playerPosition: engine.Vector2;
            renderedMap.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell.includes(`id="entity-${this.entityId}"`)) {
                        playerPosition = new engine.Vector2(x, y);
                        return;
                    }
                });
                if (playerPosition) return;
            });
            const canvasCenter = this.canvasSize.div(2).transform(Math.floor);
            renderedMap = _.range(playerPosition.y - canvasCenter.y, playerPosition.y + canvasCenter.y).map((y, cy) => {
                if (y < 0 || y >= renderedMap.length) return new Array(this.canvasSize.x).fill(" ");
                return _.range(playerPosition.x - canvasCenter.x, playerPosition.x + canvasCenter.x).map((x, cx) => {
                    if (x < 0 || x >= renderedMap[y].length) return " ";
                    return renderedMap[y][x];
                });
            });
        })();
        $("#canvas").html(renderedMap.map(r => r.join("")).join("\n"));
    }

    public onStats(stats: string): void {
        $("#stats").html(stats);
    }

    public onChat(msg: ChatMessage): void {
        if (msg.auto && $(".nafm-flag[data-name='auto']").prop("checked") === false) return;
        const output: HTMLElement = document.getElementById("chat-output");
        const timestamp: string = moment(msg.timestamp).format("hh:mm a");
        output.innerHTML += `(${timestamp}) &lt;<span style="color: ${msg.color};">${msg.name}</span>&gt; ${msg.message}\n`;
        $(output).scrollTop($(output).prop("scrollHeight"));
    }

    private onKeyPress(evt: JQuery.Event): void {
        if (this.socket.disconnected) return;
        if ($(evt.target).prop("id") === "chat-input") {
            if (evt.which === 13) {
                this.socket.emit("chat", $("#chat-input").val());
                $("#chat-input").val("");
            }
            return;
        }
        if ((<KeyboardEvent>evt.originalEvent).repeat) return;
        let direction: engine.Direction;
        if (evt.which === JQuery.Key.ArrowUp || evt.which === JQuery.Key.W) direction = engine.Direction.Up;
        if (evt.which === JQuery.Key.ArrowDown || evt.which === JQuery.Key.S) direction = engine.Direction.Down;
        if (evt.which === JQuery.Key.ArrowLeft || evt.which === JQuery.Key.A) direction = engine.Direction.Left;
        if (evt.which === JQuery.Key.ArrowRight || evt.which === JQuery.Key.D) direction = engine.Direction.Right;
        if (direction === undefined) return;
        this.socket.emit("move", direction);
    }
}
