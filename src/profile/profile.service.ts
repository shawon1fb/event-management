import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async findAll(): Promise<Profile[]> {
    try {
      let profiles = await this.prisma.profile.findMany({
        include: {
          user: true,
        },
      });

      profiles = profiles.map((profile) => {
        delete profile.user.role;
        delete profile.user.hashRt;
        delete profile.user.updatedAt;
        delete profile.user.createdAt;
        delete profile.user.id;
        delete profile.user.hash;
        return profile;
      });

      return profiles;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
