import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENTS_MODEL') private commentsModel: Model<Comment>,
  ) {}
}
