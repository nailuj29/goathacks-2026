import { DatabaseModule } from 'src/database/database.module';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.provider';
import { PostsService } from './posts.service';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: `${process.env.POSTS_DIR}`,
      serveRoot: '/posts/images',
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, ...postsProviders],
})
export class PostsModule {}
