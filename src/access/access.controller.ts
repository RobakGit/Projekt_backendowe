import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AccessGuard, ReaderGuard, WriterGuard } from "src/auth/roles.guards";
import { AccessService } from "./access.service";

@Controller("access")
export class AccessController {
  constructor(private accessService: AccessService) {}

  @UseGuards(ReaderGuard)
  @Post("/payment")
  async create(@Body() data, @Request() req) {
    return this.accessService.makePayment(data, req);
  }
}
