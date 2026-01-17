import { Types } from 'mongoose';

export interface ApiUser {
  readonly username: string;
  readonly name: string;
  readonly id: Types.ObjectId;
}
