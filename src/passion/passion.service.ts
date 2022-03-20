import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePassionDto } from './dto/create-passion.dto';
import { UpdatePassionDto } from './dto/update-passion.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class PassionService {
  constructor(private prisma: PrismaService) {}

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

  update(id: number, updatePassionDto: UpdatePassionDto) {
    return `This action updates a #${id} passion`;
  }

  remove(id: number) {
    return `This action removes a #${id} passion`;
  }
}
