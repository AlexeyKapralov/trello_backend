import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentViewDto } from '../api/dto/output/comment-view-dto';
import { Comment } from '../domain/comments-entity';
import { QueryDto } from '../../../common/dto/query-dto';
import { Paginator } from '../../../common/dto/paginator-dto';
import { commentToCommentDtoMapper } from '../../../base/mappers/comment-view-mapper';

@Injectable()
export class CommentsQueryRepository {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async findCommentsByCardId(
        query: QueryDto,
        cardId: string,
    ): Promise<Paginator<CommentViewDto>> {
        let countComments = 0;
        const commentsRepository = this.dataSource.getRepository(Comment);

        countComments = await commentsRepository.count({
            where: {
                cardId: cardId,
                isDeleted: false,
            },
        });

        const comments = await commentsRepository.find({
            where: {
                cardId: cardId,
                isDeleted: false,
            },
            order: {
                [query.sortBy]: query.sortDirection,
            },
            take: query.pageSize,
            skip: (query.pageNumber - 1) * query.pageSize,
        });

        return {
            pagesCount: Math.ceil(countComments / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: countComments,
            items: comments.map((c) => commentToCommentDtoMapper(c)),
        };
    }

    async findCommentById(commentId: string): Promise<CommentViewDto> {
        const commentsRepository = this.dataSource.getRepository(Comment);

        const comment = await commentsRepository.findOne({
            where: {
                id: commentId,
                isDeleted: false,
            },
        });
        return comment ? commentToCommentDtoMapper(comment) : null;
    }

    async findCommentByIdAndUserId(
        commentId: string,
        userId: string,
    ): Promise<CommentViewDto> {
        const commentsRepository = this.dataSource.getRepository(Comment);

        const comment = await commentsRepository.findOne({
            where: {
                id: commentId,
                userId: userId,
                isDeleted: false,
            },
        });
        return comment ? commentToCommentDtoMapper(comment) : null;
    }
}
