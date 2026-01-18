import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiUser } from 'src/users/interfaces/api-user.interface';
import { PublishPostDto } from './dto/publish-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'node:fs/promises';
import cuid2 from '@paralleldrive/cuid2';
import { Types } from 'mongoose';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Publish a post' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  @ApiResponse({ status: 403, description: 'User not logged in' })
  @ApiBearerAuth()
  @Post('publish')
  async publish(
    @Req() request: Request & { user: ApiUser },
    @Body() publishPostDto: PublishPostDto,
  ) {
    return await this.postsService.publish(request.user, publishPostDto);
  }

  @ApiOperation({ summary: 'Upload an image for a post' })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 403, description: 'User not logged in' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'image',
    description: 'The JPEG image to upload',
    type: 'file',
  })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload-image')
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 20_000_000,
            errorMessage: 'Uploaded image too large',
          }),
          new FileTypeValidator({
            fileType: 'image/jpeg',
            errorMessage: 'Image must be a JPEG',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const id = cuid2.createId();
    await writeFile(`${process.env.POSTS_DIR}/${id}.jpg`, file.buffer);

    return { path: `/posts/images/${id}.jpg` };
  }

  @ApiOperation({ summary: 'Get posts by currently logged-in user' })
  @ApiResponse({ status: 200, description: 'The posts' })
  @ApiResponse({ status: 403, description: 'The user is not logged in' })
  @Get('me')
  async myPosts(@Req() request: Request & { user: ApiUser }) {
    return this.postsService.getBy(request.user.id);
  }

  @ApiOperation({ summary: 'Get posts by specified user' })
  @ApiResponse({ status: 200, description: 'The posts' })
  @ApiResponse({ status: 403, description: 'The user is not logged in' })
  @ApiParam({ name: 'uid', description: 'The user id of the specified user' })
  @ApiBearerAuth()
  @Get('user/:uid')
  async userPosts(@Param('uid') userId: string) {
    if (!userId.match(/^[0-9a-f]{24}$/)) {
      throw new BadRequestException('Invalid userId');
    }
    return this.postsService.getBy(new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: 'Get all posts on platform' })
  @ApiResponse({ status: 200, description: 'The posts' })
  @ApiResponse({ status: 403, description: 'The user is not logged in' })
  @ApiBearerAuth()
  @Get('all')
  async allPosts() {
    return this.postsService.getAll();
  }
}
