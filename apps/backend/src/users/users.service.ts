import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import bcrypt from 'node_modules/bcryptjs';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(
    username: string,
    name: string,
    password: string,
  ): Promise<string> {
    const hashedPass = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username,
      name,
      hashedPass,
    });
    await createdUser.save();

    return sign(
      {
        id: createdUser._id,
      },
      process.env['JWT_SEC']!,
    );
  }
}
