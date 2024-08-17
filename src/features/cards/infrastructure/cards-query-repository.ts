import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Card } from '../domain/cards-entity';
import { CardViewDto } from '../api/dto/output/card-view-dto';
import { cardToCardDtoMapper } from '../../../base/mappers/card-view-mapper';
import { Paginator } from '../../../common/dto/paginator-dto';
import { QueryDto } from '../../../common/dto/query-dto';

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
        query: QueryDto,
    ): Promise<Paginator<CardViewDto>> {
        let countCards = 0;
        const cardsRepository = this.dataSource.getRepository(Card);
        countCards = await cardsRepository.count({
            where: {
                columnId: columnId,
                isDeleted: false,
            },
        });

        const cards = await cardsRepository.find({
            where: {
                columnId: columnId,
                isDeleted: false,
            },
            order: {
                [query.sortBy]: query.sortDirection,
            },
            take: query.pageSize,
            skip: (query.pageNumber - 1) * query.pageSize,
        });

        return {
            pagesCount: Math.ceil(countCards / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount: countCards,
            items: cards.map((c) => cardToCardDtoMapper(c)),
        };
    }

    async findCardWithCommentsById(cardId: string): Promise<Card> {
        return await this.dataSource
            .getRepository(Card)
            .createQueryBuilder('card')
            .where('card.id = :cardId', { cardId })
            .leftJoinAndSelect('card.comments', 'comments')
            .select([
                'card.id',
                'card.name',
                'card.description',
                'card.createdAt',
                'card.userId',
                'comments.id',
                'comments.text',
                'comments.createdAt',
                'comments.id',
                'comments.id',
                'comments.id',
                'comments.id',
            ])
            .getOne();
    }

    async findCardByCardIdAndUserId(
        cardId: string,
        userId: string,
    ): Promise<CardViewDto> {
        const cardRepository = this.dataSource.getRepository(Card);

        const card = await cardRepository.findOne({
            where: {
                id: cardId,
                userId: userId,
                isDeleted: false,
            },
        });

        return card ? cardToCardDtoMapper(card) : null;
    }
}
