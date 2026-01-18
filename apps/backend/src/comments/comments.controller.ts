import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Request } from 'express';
import { ApiUser } from 'src/users/interfaces/api-user.interface';
import { AddCommentDto } from './dto/add-comment.dto';
import { PostsService } from 'src/posts/posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {}

  @ApiOperation({ summary: 'Add a comment' })
  @ApiParam({
    name: 'post_id',
    description: 'The id of the post to comment on',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated post, with the comment',
  })
  @Post('/:post_id/add')
  async addComment(
    @Req() request: Request & { user: ApiUser },
    @Body() commentDto: AddCommentDto,
    @Param('post_id') postId: string,
  ) {
    if (!postId.match(/^[0-9a-f]{24}$/)) {
      throw new BadRequestException('Invalid postId');
    }

    return this.commentsService.addComment(request.user, commentDto, postId);
  }
}
