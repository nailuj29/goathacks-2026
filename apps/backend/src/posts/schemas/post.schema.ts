import mongoose, { Schema } from 'mongoose';

export const PostSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  images: { type: [String], required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});
