import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
      private jwtService: JwtService
      ) {}

  async login(data: Prisma.UserWhereInput) {
    if(!data.name || !data.password){
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
    }

    const [{uid, name, password}] = await this.prisma.user.findMany({
        where: {
            OR: [
                {email: data.name},
                {name: data.name}
            ]
        }
    })

    if(bcrypt.compareSync(data.password, password)){
        return {
            access_token: this.jwtService.sign({name, uid})
        }
    }

    throw new UnauthorizedException('Bad login or password')
  }
}