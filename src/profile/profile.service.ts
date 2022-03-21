import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Profile[]> {
    try {
      return await this.prisma.profile.findMany({
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findOne(id: number) {
    try {
      return this.prisma.profile.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      const userTestStatus: { id: number }[] = [
        ...updateProfileDto.passion.map((v) => ({ id: v })),
      ];

      return this.prisma.profile.update({
        where: {
          id,
        },
        data: {
          bio: updateProfileDto.bio,
          firstname: updateProfileDto.firstname,
          lastname: updateProfileDto.lastname,
          username: updateProfileDto.username,
          job_title: updateProfileDto.job_title,
          school: updateProfileDto.school,
          gender: updateProfileDto.gender,
          city: updateProfileDto.city,
          passion: {
            connect: userTestStatus,
          },
        },

        include: {
          passion: true,
        },
      });
    } catch (e) {
      if (e.message === 'No data returned from the query.') {
        throw new NotFoundException();
      }

      throw new BadRequestException();
    }
  }
}
