import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { commentsProviders } from './comments.provider';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [UsersModule, DatabaseModule, PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService, ...commentsProviders],
})
export class CommentsModule {}
