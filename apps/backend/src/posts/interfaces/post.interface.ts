import { Document, Types } from 'mongoose';

export interface Post extends Document {
  readonly caption: string;
  readonly images: string[];
  readonly author: Types.ObjectId;
}
