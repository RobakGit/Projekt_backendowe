import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [JwtModule.registerAsync({
    inject: [ConfigService],
    imports: [ConfigModule],
    useFactory: (configSerivce: ConfigService) => ({
        secret: configSerivce.jwtSecret,
        signOptions: { expiresIn: '24h' },
    }),
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}