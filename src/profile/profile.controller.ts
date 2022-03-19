import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get('all')
  findAll(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Post('update/:id')
  @FormDataRequest()
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    console.log(updateProfileDto);
    return updateProfileDto;
    // return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
