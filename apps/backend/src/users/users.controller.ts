import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiUser } from './interfaces/api-user.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register the user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.usersService.create(registerUserDto);
  }

  @ApiOperation({ summary: 'Log in the user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 403, description: 'User credentials incorrect' })
  @ApiResponse({ status: 404, description: 'User does not exist' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @ApiOperation({ summary: "Get the currently logged-in user's information" })
  @ApiResponse({ status: 200, description: 'User information' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard)
  info(@Req() req: Request & { user: ApiUser }) {
    return req.user;
  }
}
