import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePassionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
