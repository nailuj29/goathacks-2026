import { ApiProperty } from '@nestjs/swagger';

export class PublishPostDto {
  @ApiProperty()
  readonly images: string[];

  @ApiProperty()
  readonly caption: string;
}
