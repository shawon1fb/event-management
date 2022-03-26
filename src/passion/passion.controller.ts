import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PassionService } from './passion.service';
import { CreatePassionDto } from './dto/create-passion.dto';
import { UpdatePassionDto } from './dto/update-passion.dto';
import { JwtAuthGuard } from '../auth/guards';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('passion')
export class PassionController {
  constructor(private readonly passionService: PassionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPassionDto: CreatePassionDto) {
    return this.passionService.create(createPassionDto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.user)
  @Get()
  findAll() {
    return this.passionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePassionDto: UpdatePassionDto) {
    return this.passionService.update(+id, updatePassionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passionService.remove(+id);
  }
}
