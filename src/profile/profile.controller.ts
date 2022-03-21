import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/guards';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Profile> {
    return this.profileService.findOne(+id);
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
    //   return updateProfileDto;
    return this.profileService.update(+id, updateProfileDto);
  }
}
