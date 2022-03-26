import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private cacheService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;

    const user: User = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    ///todo: update needed from logout
    // const user: User = await this.cacheService.remember(
    //   `auth_user_${email}`,
    //   3600,
    //   () =>
    //     this.prisma.user.findUnique({
    //       where: { email },
    //       include: {
    //         profile: true,
    //       },
    //     }),
    // );

    if (!user) {
      throw new UnauthorizedException('unauthorized');
    }

    // console.log(user);
    if (user.hashRt === null) {
      throw new UnauthorizedException('unauthorized');
    }
    // console.log(user);
    return user;
  }
}
