import mongoose, { Schema } from 'mongoose';

export const PostSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    images: { type: [String], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});
