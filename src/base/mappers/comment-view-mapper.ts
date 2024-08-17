import { Columns } from '../../features/columns/domain/columns-entity';
import { ColumnViewDto } from '../../features/columns/api/dto/output/column-view-dto';
import { Comment } from '../../features/comments/domain/comments-entity';
import { CommentViewDto } from '../../features/comments/api/dto/output/comment-view-dto';

export const commentToCommentDtoMapper = (comment: Comment): CommentViewDto => {
    return {
        id: comment.id,
        text: comment.text,
        userId: comment.userId,
        createdAt: comment.createdAt.toISOString(),
    };
};
