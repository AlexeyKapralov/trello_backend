import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { IsString, Length } from 'class-validator';

export class CommentInputDto {
    @ApiProperty({
        example: 'some text bla-bla-bla',
    })
    @Trim()
    @Length(1, 500)
    @IsString()
    text: string;
}
