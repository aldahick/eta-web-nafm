import { Module } from "@nestjs/common";
import { GameGateway } from "./gateways/GameGateway";

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway],
})
export class AppModule {}
