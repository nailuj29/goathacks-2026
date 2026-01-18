import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { commentsProviders } from './comments.provider';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [],
  providers: [...commentsProviders],
})
export class CommentsModule {}
