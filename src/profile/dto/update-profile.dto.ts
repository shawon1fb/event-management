import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  // bio: string;
  // firstname: string;
  // lastname: string;
  // username: string;
  // job_title: string;
  // school: string;
  // gender: string;
  // city: string;
  // passion: string[];
}
