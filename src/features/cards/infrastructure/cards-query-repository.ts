import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Card } from '../domain/cards-entity';
import { CardViewDto } from '../api/dto/output/card-view-dto';
import { cardToCardDtoMapper } from '../../../base/mappers/card-view-mapper';
import { CardsWithCommentsViewDto } from '../api/dto/output/cards-with-comments-view-dto';
import { cardToCardWithCommentsDtoMapper } from '../../../base/mappers/card-with-comments-view-mapper';

@Injectable()
export class CardsQueryRepository {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async findCardById(cardId: string): Promise<CardViewDto> {
        const cardsRepository = this.dataSource.getRepository(Card);

        const card = await cardsRepository.findOne({
            where: {
                id: cardId,
            },
        });

        return card ? cardToCardDtoMapper(card) : null;
    }
    async findCardsByColumnId(
        columnId: string,
    ): Promise<CardsWithCommentsViewDto[]> {
        const cards: Card[] = await this.dataSource
            .getRepository(Card)
            .createQueryBuilder('card')
            .where('card.columnId = :columnId', { columnId })
            .andWhere('card.isDeleted = :status', { status: false })
            .leftJoinAndSelect('card.comments', 'comments')
            .getMany();

        return cards.map((c) => cardToCardWithCommentsDtoMapper(c));
    }
}
