import { Document, Types } from 'mongoose';

export interface Comment extends Document {
  readonly text: string;
  readonly author: Types.ObjectId;
  readonly post: Types.ObjectId;
}
