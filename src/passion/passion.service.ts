import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePassionDto } from './dto/create-passion.dto';
import { UpdatePassionDto } from './dto/update-passion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RedisService } from '../redis/redis.service';
import { Passion } from '@prisma/client';

@Injectable()
export class PassionService {
  constructor(
    private prisma: PrismaService,
    private redisCache: RedisService,
  ) {}

  async create(createPassionDto: CreatePassionDto) {
    try {
      console.log(createPassionDto);
      return await this.prisma.passion.create({
        data: {
          name: createPassionDto.name,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Passion already exists');
        }
      }
      throw new BadRequestException('server error');
    }
  }

  findAll() {
    return this.prisma.passion.findMany();
  }

  async findOne(id: number): Promise<Passion> {
    try {
      const passion = await this.prisma.passion.findUnique({
        where: {
          id: id,
        },
      });
      if (!passion) {
        throw new BadRequestException('passion not found');
      }
      return passion;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException('Passion not found');
        }
      }

      if (e instanceof BadRequestException) {
        throw e;
      }

      throw new BadRequestException('server error');
    }
  }

  async update(id: number, updatePassionDto: UpdatePassionDto) {
    try {
      return await this.prisma.passion.update({
        where: {
          id,
        },
        data: {
          name: updatePassionDto.name,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException('Passion not found');
        }
      }
      throw new BadRequestException('server error');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.passion.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('Passion already exists');
        } else if (e.code === 'P2025') {
          throw new BadRequestException('Passion does not exist');
        }
      }
      throw new BadRequestException('server error');
    }
  }
}
