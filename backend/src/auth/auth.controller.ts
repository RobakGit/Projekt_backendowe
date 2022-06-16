import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post()
  async login(@Body() data: Prisma.UserWhereInput) {
    return this.authService.login(data)
  }
}