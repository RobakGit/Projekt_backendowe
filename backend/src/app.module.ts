import { Module } from "@nestjs/common";
import { AccessModule } from "./access/access.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArticleModule } from "./article/article.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma.service";
import { UserModule } from "./user/user.module";

@Module({
  imports: [UserModule, AuthModule, ArticleModule, AccessModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
