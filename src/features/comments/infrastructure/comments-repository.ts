import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentViewDto } from '../api/dto/output/comment-view-dto';
import { Card } from '../../cards/domain/cards-entity';
import { Comment } from '../domain/comments-entity';
import { CommentInputDto } from '../api/dto/input/comment-input-dto';

@Injectable()
export class CommentsRepository {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async createComment(
        commentInputDto: CommentInputDto,
        userId: string,
        cardId: string,
    ): Promise<Comment> {
        const commentsRepository = this.dataSource.getRepository(Comment);

        const comment = new Comment();
        comment.cardId = cardId;
        comment.createdAt = new Date(new Date().toISOString());
        comment.userId = userId;
        comment.isDeleted = false;
        comment.text = commentInputDto.text;

        return await commentsRepository.save(comment);
    }
}
