import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AccessGuard, ReaderGuard, WriterGuard } from "src/auth/roles.guards";
import { ArticleService } from "./article.service";

@Controller("article")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(WriterGuard)
  @Post("")
  async create(@Body() data: Prisma.ArticleCreateInput, @Request() req) {
    return this.articleService.createArticle(data, req);
  }

  @UseGuards(ReaderGuard)
  @Get("")
  async getArticleList() {
    return this.articleService.getArticleList();
  }

  @UseGuards(AccessGuard)
  @Get(":uid")
  async getArticle(@Param("uid") uid: string) {
    return this.articleService.getArticle(uid);
  }

  @UseGuards(WriterGuard)
  @Post(":uid")
  async updateArticle(@Body() data, @Param("uid") uid: string) {
    return this.articleService.updateArticle(data, uid);
  }
}
