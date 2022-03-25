import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePassionDto } from './dto/create-passion.dto';
import { UpdatePassionDto } from './dto/update-passion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { RedisService } from '../redis/redis.service';

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

  findOne(id: number) {
    return this.prisma.passion.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: number, updatePassionDto: UpdatePassionDto) {
    const s = await this.redisCache.get('passion');
    const a = await this.redisCache.has('passion');
    // await this.redisCache.clear();
    return `This action updates a #${id} passion ${s} `;
  }

  async remove(id: number) {
    await this.redisCache.set(
      'passion' + id.toString(),
      'passion ' + id.toString(),
    );

    const s = await this.redisCache.get('passion');
    // await this.redisCache.clear();
    const b = await this.redisCache.has('passion');
    console.log(s);
    return `This action removes a #${id} passion ${s} ${b} `;
  }
}
