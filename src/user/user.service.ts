import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {

    const {email, name, password, firstName, lastName} = data

    if(!email || !name || !password || !firstName || !lastName){
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      throw new HttpException('Incorrect email', HttpStatus.BAD_REQUEST)
    }

    if(password.length < 8) {
      throw new HttpException('Password too short', HttpStatus.BAD_REQUEST)
    }

    data.password = bcrypt.hashSync(password, 10)
    return this.prisma.user.create({
      data
    });
  }
}