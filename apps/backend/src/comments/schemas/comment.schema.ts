import mongoose, { Schema } from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
});
