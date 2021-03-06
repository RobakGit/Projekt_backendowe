import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { articleStatus, Prisma } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createArticle(data: Prisma.ArticleCreateInput, req) {
    const decode: any = jwt.verify(req.headers.token, this.config.jwtSecret);

    data.user = { connect: { uid: decode.uid } };

    return this.prisma.article.create({
      data,
    });
  }

  async getArticleList() {
    return await this.prisma.article.findMany({
      where: { status: articleStatus.active },
      select: { uid: true, user: { select: { name: true } }, tag: true, title: true, createdAt: true },
    });
  }

  async getArticle(uid: string) {
    return await this.prisma.article.findUnique({
      select: { uid: true, user: { select: { name: true } }, tag: true, title: true, content: true, createdAt: true, updatedAt: true },
      where: { uid },
    });
  }

  async updateArticle(data, uid: string) {
    return await this.prisma.article.updateMany({
      data,
      where: { uid },
    });
  }
}
