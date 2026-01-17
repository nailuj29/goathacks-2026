import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiUser } from './interfaces/api-user.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register the user' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.create(registerUserDto);
  }

  @ApiOperation({ summary: 'Log in the user' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @ApiOperation({ summary: "Get the currently logged-in user's information" })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  info(@Req() req: Request & { user: ApiUser }) {
    return req.user;
  }
}
