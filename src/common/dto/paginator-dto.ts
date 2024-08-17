import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentViewDto } from '../../features/comments/api/dto/output/comment-view-dto';
import { CardViewDto } from '../../features/cards/api/dto/output/card-view-dto';

export type Paginator<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<T>;
};

export class PaginatorWithCardsDto {
    @ApiProperty()
    pagesCount: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalCount: number;

    @ApiPropertyOptional({ type: [CardViewDto] })
    cards: CardViewDto[];
}

export class PaginatorWithCommentsDto {
    @ApiProperty()
    pagesCount: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    totalCount: number;

    @ApiPropertyOptional({ type: [CommentViewDto] })
    comments: CommentViewDto[];
}
