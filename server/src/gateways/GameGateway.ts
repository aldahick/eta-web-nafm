import { WebSocketGateway, SubscribeMessage } from "@nestjs/websockets";
import { Direction } from "../lib/Direction";

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage("move")
  move(client: SocketIO.Socket, direction: Direction) {
    console.log("moving in direction", Direction[direction]);
  }
}
