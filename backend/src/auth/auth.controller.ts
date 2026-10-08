import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HttpCode } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import type { JwtPayload } from './auth.types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
