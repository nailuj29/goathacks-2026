import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import type { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class JwtService {
  constructor(
    @Inject('USERS_MODEL')
    private userModel: Model<User>,
  ) {}

  mint(userId: string): string {
    return jwt.sign(
      {
        id: userId,
      },
      process.env['JWT_SEC']!,
    );
  }

  async extract(token: string): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: { id: string } = jwt.verify(
      token,
      process.env['JWT_SEC']!,
    ) as any;

    const user = await this.userModel.findById(payload.id).exec();
    if (user) return user;

    throw new NotFoundException();
  }
}
