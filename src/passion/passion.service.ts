import { Injectable } from '@nestjs/common';
import { CreatePassionDto } from './dto/create-passion.dto';
import { UpdatePassionDto } from './dto/update-passion.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PassionService {
  constructor(private prisma: PrismaService) {}

  create(createPassionDto: CreatePassionDto) {
    return this.prisma.passion.create({
      data: {
        name: createPassionDto.name,
      },
    });
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
