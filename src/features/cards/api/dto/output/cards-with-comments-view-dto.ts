import { IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CardViewDto } from './card-view-dto';
import { CommentViewDto } from '../../../../comments/api/dto/output/comment-view-dto';

export class CardsWithCommentsViewDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    userId: string;

    @ApiPropertyOptional({ type: [CommentViewDto] })
    comments: CommentViewDto[];
}
