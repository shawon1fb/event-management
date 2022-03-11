import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login.auth.dto';
import { JwtPayload, Token } from './types';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async getTokens(payload: JwtPayload): Promise<Token> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: this.config.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.config.get('RT_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateHashRt(userId: number, rt: string) {
    const hash: string = await this.hashData(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashRt: hash,
      },
    });
  }

  async hashData(data: string) {
    return await argon.hash(data);
  }

  async signIn(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isValid = await argon.verify(user.hash, password);

    if (!isValid) {
      throw new ForbiddenException('Invalid password');
    }

    const { id } = user;
    const token: Token = await this.getTokens({ id, email });
    await this.updateHashRt(user.id, token.refreshToken);
    delete user.hash;
    delete user.hashRt;
    return { ...user, ...token };
  }

  async signUp(dto: CreateAuthDto) {
    try {
      const hash: string = await this.hashData(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          profile: {
            create: {
              username: dto.username,
            },
          },
        },
        include: {
          profile: true,
        },
      });
      delete user.hash;
      delete user.hashRt;
      delete user.role;
      delete user.createdAt;
      delete user.updatedAt;
      console.log(typeof user);
      const tokens = await this.getTokens({ email: dto.email, id: user.id });
      await this.updateHashRt(user.id, tokens.refreshToken);
      return { ...user, ...tokens };
    } catch (e) {
      console.log(typeof e);
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw new BadRequestException('server error');
    }
  }

  async logout(userId: number) {
    try {
      await this.prisma.user.updateMany({
        where: {
          id: userId,
          hashRt: {
            not: null,
          },
        },
        data: {
          hashRt: null,
        },
      });
      return { success: 'successfully logout' };
    } catch (e) {
      console.log(e);
      throw new BadRequestException('something went wrong');
    }
  }

  async refreshTokens(user: User): Promise<Token> {
    try {
      if (!user || !user.hashRt) throw new ForbiddenException('Access Denied');
      const tokens = await this.getTokens({ id: user.id, email: user.email });
      await this.updateRtHash(user.id, tokens.refreshToken);
      return tokens;
    } catch (e) {
      console.log(e);
      if (e instanceof ForbiddenException) {
        throw e;
      }
      throw new BadRequestException('something went wrong');
    }
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }
}
