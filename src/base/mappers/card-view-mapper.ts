import { Card } from '../../features/cards/domain/cards-entity';
import { CardViewDto } from '../../features/cards/api/dto/output/card-view-dto';

export const cardToCardDtoMapper = (card: Card): CardViewDto => {
    return {
        id: card.id,
        name: card.name,
        description: card.description,
        createdAt: card.createdAt.toISOString(),
        userId: card.userId,
    };
};
