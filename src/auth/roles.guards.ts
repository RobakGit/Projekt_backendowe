import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "src/config/config.service";
import * as jwt from "jsonwebtoken";
import { haveAccess, isAdmin, isReader, isTokenExpired, isWriter } from "./utils";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const userJWT = context.switchToHttp().getRequest().headers.token;
      const decode: any = jwt.verify(userJWT, this.config.jwtSecret);
      const user = await this.prisma.user.findUnique({ select: { role: { select: { name: true } } }, where: { uid: decode.uid } });

      if (!isTokenExpired(decode)) {
        throw new UnauthorizedException("token has expired");
      }

      if (isAdmin(user.role.name)) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}

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

@Injectable()
export class ReaderGuard implements CanActivate {
  constructor(private reflector: Reflector, private config: ConfigService, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const userJWT = context.switchToHttp().getRequest().headers.token;
      const decode: any = jwt.verify(userJWT, this.config.jwtSecret);
      const user = await this.prisma.user.findUnique({ select: { role: { select: { name: true } } }, where: { uid: decode.uid } });

      if (!isTokenExpired(decode)) {
        throw new UnauthorizedException("token has expired");
      }

      if (isReader(user.role.name)) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}

@Injectable()
export class AccessGuard implements CanActivate {
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

      if (haveAccess()) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
