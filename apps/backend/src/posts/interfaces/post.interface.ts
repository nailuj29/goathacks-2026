import { Document, ObjectId } from 'mongoose';

export interface Post extends Document {
  readonly caption: string;
  readonly images: string[];
  readonly author: ObjectId;
}
