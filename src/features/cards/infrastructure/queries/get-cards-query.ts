import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/interlayer';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Card } from '../../domain/cards-entity';
import { QueryDto } from '../../../../common/dto/query-dto';
import { Paginator } from '../../../../common/dto/paginator-dto';
import { cardToCardDtoMapper } from '../../../../base/mappers/card-view-mapper';
import { CardViewDto } from '../../api/dto/output/card-view-dto';

export class FindCardsQueryPayload implements IQuery {
    constructor(
        public userId: string,
        public query: QueryDto,
    ) {}
}

@QueryHandler(FindCardsQueryPayload)
export class FindCardsQuery
    implements
        IQueryHandler<
            FindCardsQueryPayload,
            InterlayerNotice<FindCardsQueryResultType>
        >
{
    constructor(@InjectDataSource() private dataSource: DataSource) {}
    async execute(queryPayload: FindCardsQueryPayload) {
        const notice = new InterlayerNotice<FindCardsQueryResultType>();
        let countCards = 0;
        const cardRepository = this.dataSource.getRepository(Card);
        countCards = await cardRepository.count({
            where: {
                userId: queryPayload.userId,
                isDeleted: false,
            },
        });

        const cardsRepository = this.dataSource.getRepository(Card);

        const cards = await cardsRepository.find({
            where: {
                userId: queryPayload.userId,
                isDeleted: false,
            },
            order: {
                [queryPayload.query.sortBy]: queryPayload.query.sortDirection,
            },
            take: queryPayload.query.pageSize,
            skip:
                (queryPayload.query.pageNumber - 1) *
                queryPayload.query.pageSize,
        });

        const cardsPaginator: Paginator<CardViewDto> = {
            pagesCount: Math.ceil(countCards / queryPayload.query.pageSize),
            page: queryPayload.query.pageNumber,
            pageSize: queryPayload.query.pageSize,
            totalCount: countCards,
            items: cards.map((c) => cardToCardDtoMapper(c)),
        };

        notice.addData(cardsPaginator);

        return notice;
    }
}

export type FindCardsQueryResultType = Paginator<CardViewDto>;
