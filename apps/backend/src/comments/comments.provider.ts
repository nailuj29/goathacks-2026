import { Connection } from 'mongoose';
import { CommentSchema } from './schemas/comment.schema';

export const commentsProviders = [
  {
    provide: 'COMMENTS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Comment', CommentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
