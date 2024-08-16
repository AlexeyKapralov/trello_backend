import { ApiProperty } from '@nestjs/swagger';

export class CommentViewDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    text: string;

    @ApiProperty()
    userId: string;
}
