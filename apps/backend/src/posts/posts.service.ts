import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from './interfaces/post.interface';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_MODEL')
    private postsModel: Model<Post>,
  ) {}

  async publish(user: User, caption: string, image_paths: string[]) {
    const post = new this.postsModel({
      caption,
      images: image_paths,
      author: user._id,
    });

    await post.save();
  }
}
