import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AccessGuard, WriterGuard } from "src/auth/roles.guards";
import { ArticleService } from "./article.service";

@Controller("article")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(WriterGuard)
  @Post("")
  async create(@Body() data: Prisma.ArticleCreateInput, @Request() req) {
    return this.articleService.createArticle(data, req);
  }

  @UseGuards(AccessGuard)
  @Get(":uid")
  async getArticle(@Param("uid") uid: string) {
    return this.articleService.getArticle(uid);
  }
}
