import { PartialType } from '@nestjs/mapped-types';
import { CreatePassionDto } from './create-passion.dto';

export class UpdatePassionDto extends PartialType(CreatePassionDto) {}
