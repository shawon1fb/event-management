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
      let passion: { id: number }[] = [];
      let avatars: {
        url: string;
        position: number;
      }[] = [];

      if (updateProfileDto.passion !== undefined) {
        passion = updateProfileDto.passion.map((v) => ({ id: v }));
      }

      if (updateProfileDto.avatars !== undefined) {
        avatars = updateProfileDto.avatars.map((v) => ({
          url: v.originalName,
          position: 0,
        }));
      }

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
          avaters: {
            create: avatars,
          },
          passion: {
            connect: passion,
          },
        },

        include: {
          passion: true,
          avaters: true,
        },
      });
    } catch (e) {
      console.log(e);
      if (e.message === 'No data returned from the query.') {
        throw new NotFoundException();
      }
      throw new BadRequestException();
    }
  }
}
