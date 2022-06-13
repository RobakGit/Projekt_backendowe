import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "src/config/config.service";
import * as jwt from "jsonwebtoken";
import { isTokenExpired, isWriter } from "./utils";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class WriterGuard implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const userJWT = context.switchToHttp().getRequest().headers.token;
      const decode: any = jwt.verify(userJWT, this.config.jwtSecret);
      const user = await this.prisma.user.findUnique({ select: { role: { select: { name: true } } }, where: { uid: decode.uid } });

      if (!isTokenExpired(decode)) {
        throw new UnauthorizedException("token has expired");
      }

      if (isWriter(user.role.name)) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
