import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFiles,
  MaxFileSize,
} from 'nestjs-form-data';
import { Type } from 'class-transformer';

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

  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber({}, { each: true })
  // passion: string[];

  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  passion: number[];

  @IsFiles()
  @MaxFileSize(1e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  avatars: FileSystemStoredFile[];
}
