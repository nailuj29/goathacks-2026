import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ApiUser } from 'src/users/interfaces/api-user.interface';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './interfaces/comment.interface';
import { Post } from 'src/posts/interfaces/post.interface';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENTS_MODEL') private commentsModel: Model<Comment>,
    @Inject('POSTS_MODEL') private postsModel: Model<Post>,
  ) {}

  async addComment(user: ApiUser, commentDto: AddCommentDto, postId: string) {
    const comment = new this.commentsModel({
      author: new Types.ObjectId(user.id),
      post: new Types.ObjectId(postId),
      text: commentDto.text,
    });

    await comment.save();

    return await this.postsModel
      .findById(postId)
      .populate({
        path: 'author',
        select: 'name username _id',
      })
      .populate({
        path: 'comments',
        options: {
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: 'author',
          select: 'name username _id',
        },
        select: 'text author',
      });
  }
}
