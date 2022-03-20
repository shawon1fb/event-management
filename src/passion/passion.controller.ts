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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('passion')
export class PassionController {
  constructor(private readonly passionService: PassionService) {}

  @Post()
  create(@Body() createPassionDto: CreatePassionDto) {
    return this.passionService.create(createPassionDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
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
