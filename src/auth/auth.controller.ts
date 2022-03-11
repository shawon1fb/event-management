import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.auth.dto';
import { JwtAuthGuard, RtGuard } from './guards';
import { GetUser } from './decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.signIn(loginAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@GetUser() user: User) {
    return this.authService.logout(user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  @UseGuards(RtGuard)
  refreshToken(@GetUser() user: User) {
    return this.authService.refreshTokens(user);
  }
}
