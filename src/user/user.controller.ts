import { Body, Controller, Get, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  findAll(): string {
    return 'All Users';
  }

  @Post('')
  async create(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data)
  }
}