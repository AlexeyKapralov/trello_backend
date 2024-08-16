import { Card } from '../../features/cards/domain/cards-entity';
import { CardViewDto } from '../../features/cards/api/dto/output/card-view-dto';
import { CardsWithCommentsViewDto } from '../../features/cards/api/dto/output/cards-with-comments-view-dto';
import { commentToCommentDtoMapper } from './comment-view-mapper';

export const cardToCardWithCommentsDtoMapper = (
    card: Card,
): CardsWithCommentsViewDto => {
    const comments = card.comments.map((c) => {
        return commentToCommentDtoMapper(c);
    });
    return {
        id: card.id,
        name: card.name,
        description: card.description,
        createdAt: card.createdAt.toISOString(),
        userId: card.userId,
        comments: comments,
    };
};
