import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty()
  text: string;
}
