import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PassionService } from './passion.service';
import { CreatePassionDto } from './dto/create-passion.dto';
import { UpdatePassionDto } from './dto/update-passion.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('passion')
export class PassionController {
  constructor(private readonly passionService: PassionService) {}

  @Post()
  create(@Body() createPassionDto: CreatePassionDto) {
    return this.passionService.create(createPassionDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.passionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePassionDto: UpdatePassionDto) {
    return this.passionService.update(+id, updatePassionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passionService.remove(+id);
  }
}
