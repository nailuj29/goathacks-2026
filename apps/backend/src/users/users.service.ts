import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import bcrypt from 'node_modules/bcryptjs';
import { sign } from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL')
    private userModel: Model<User>,
  ) {}

  async create({
    username,
    name,
    password,
  }: RegisterUserDto): Promise<{ token: string }> {
    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username,
      name,
      hashedPass,
    });
    await createdUser.save();

    return {
      token: sign(
        {
          id: createdUser._id,
        },
        process.env['JWT_SEC']!,
      ),
    };
  }
}
