import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  bio: string;
  @IsString()
  firstname: string;
  @IsString()
  lastname: string;
  @IsString()
  username: string;
  @IsString()
  job_title: string;
  @IsString()
  school: string;
  @IsString()
  gender: string;
  @IsString()
  city: string;
  passion: string[];
}
