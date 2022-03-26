import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      console.log(createCategoryDto);
      return await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('category already exists');
        } else {
          throw new BadRequestException(e.message);
        }
      }
      throw new BadRequestException('server error');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.category.findMany();
    } catch (e) {
      throw new BadRequestException('server error');
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.prismaService.category.findUnique({
        where: {
          id,
        },
      });

      if (!category) {
        throw new BadRequestException('category not found');
      }
      return category;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException('Passion not found');
        }
      }
      if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      }
      throw new BadRequestException('server error');
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
