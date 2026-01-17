import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiUser } from 'src/users/interfaces/api-user.interface';
import type { PublishPostDto } from './dto/publish-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'node:fs/promises';
import cuid2 from '@paralleldrive/cuid2';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Publish a post' })
  @ApiResponse({ status: 200, description: 'Post published successfully' })
  @ApiResponse({ status: 403, description: 'User not logged in' })
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
}
