// tslint:disable no-console

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";

(async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.SERVER_PORT || 8080);
})().catch(console.error);
