import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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

    async getComment(commentId: string) {
        const commentRepository = this.dataSource.getRepository(Comment);
        return await commentRepository.findOne({
            where: {
                id: commentId,
                isDeleted: false,
            },
        });
    }
    async deleteComment(commentId: string) {
        const commentRepository = this.dataSource.getRepository(Comment);
        const isDeleted = await commentRepository.update(
            {
                id: commentId,
                isDeleted: false,
            },
            { isDeleted: true },
        );
        return isDeleted.affected === 1;
    }

    async updateComment(commentId: string, commentInputDto: CommentInputDto) {
        const commentRepository = this.dataSource.getRepository(Comment);
        const isUpdated = await commentRepository.update(
            {
                id: commentId,
                isDeleted: false,
            },
            { text: commentInputDto.text },
        );
        return isUpdated.affected === 1;
    }
}
