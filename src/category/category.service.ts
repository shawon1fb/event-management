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
          throw new BadRequestException("can't create category");
        }
      }
      throw new BadRequestException('category creation failed');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.category.findMany();
    } catch (e) {
      throw new BadRequestException("category's not found");
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
          throw new BadRequestException('category not exists');
        }
      }
      if (e instanceof BadRequestException) {
        throw new BadRequestException("can't find category");
      }
      throw new BadRequestException('category not found');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({
        where: {
          id,
        },
        data: {
          name: updateCategoryDto.name,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException('category not exists');
        } else {
          throw new BadRequestException("can't update category");
        }
      }
      throw new BadRequestException("can't update category");
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.category.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        console.log(e.code);
        if (e.code === 'P2025') {
          throw new BadRequestException('category not found');
        } else {
          throw new BadRequestException("can't delete category");
        }
      }
      throw new BadRequestException("can't delete category");
    }
  }
}
