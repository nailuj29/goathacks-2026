import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import bcrypt from 'node_modules/bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from 'src/users/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create({
    username,
    name,
    password,
  }: RegisterUserDto): Promise<{ token: string }> {
    const user = await this.userModel
      .find({
        username,
      })
      .exec();

    if (user.length > 0) {
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username,
      name,
      hashedPass,
    });
    await createdUser.save();

    return {
      token: this.jwtService.mint(createdUser.id),
    };
  }

  async login({
    username,
    password,
  }: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userModel
      .find({
        username,
      })
      .exec();

    if (user.length == 0) {
      throw new NotFoundException();
    }

    if (await bcrypt.compare(password, user[0].hashedPass)) {
      return {
        token: this.jwtService.mint(user[0].id),
      };
    } else {
      throw new ForbiddenException();
    }
  }
}
