import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from './interfaces/post.interface';
import { PublishPostDto } from './dto/publish-post.dto';
import { ApiUser } from 'src/users/interfaces/api-user.interface';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_MODEL')
    private postsModel: Model<Post>,
  ) {}

  async publish(user: ApiUser, publishPostDto: PublishPostDto): Promise<Post> {
    const post = new this.postsModel({
      ...publishPostDto,
      author: user.id,
    });

    return await post.save();
  }
}
