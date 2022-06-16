import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AccessController } from "./access.controller";
import { AccessService } from "./access.service";

@Module({
  controllers: [AccessController],
  providers: [AccessService, PrismaService],
})
export class AccessModule {}
