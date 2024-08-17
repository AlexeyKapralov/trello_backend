import { Injectable } from '@nestjs/common';
import { ColumnInputDto } from '../api/dto/input/column-input-dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { Columns } from '../domain/columns-entity';
import { UsersQueryRepository } from '../../users/infrastructure/users-query-repository';
import { ColumnsRepository } from '../infrastructure/columns-repository';
import { ColumnsQueryRepository } from '../infrastructure/columns-query-repository';
import { CardsQueryRepository } from '../../cards/infrastructure/cards-query-repository';
import { CardsWithCommentsViewDto } from '../../cards/api/dto/output/cards-with-comments-view-dto';
import { QueryDto } from '../../../common/dto/query-dto';
import { Paginator } from '../../../common/dto/paginator-dto';
import { CardViewDto } from '../../cards/api/dto/output/card-view-dto';
import { columnToColumnDtoMapper } from '../../../base/mappers/column-view-mapper';
import { ColumnViewDto } from '../api/dto/output/column-view-dto';

@Injectable()
export class ColumnsService {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private columnsRepository: ColumnsRepository,
        private columnsQueryRepository: ColumnsQueryRepository,
        private cardsQueryRepository: CardsQueryRepository,
    ) {}

    async createColumn(
        columnInputDto: ColumnInputDto,
        userId: string,
    ): Promise<InterlayerNotice<ColumnViewDto>> {
        const notice = new InterlayerNotice<ColumnViewDto>();
        const user = await this.usersQueryRepository.findUserById(userId);

        const column = await this.columnsRepository.createColumn(
            columnInputDto,
            userId,
        );
        notice.addData(columnToColumnDtoMapper(column));

        return notice;
    }

    async getColumnById(columnId: string) {
        const notice = new InterlayerNotice<ColumnViewDto>();

        const column =
            await this.columnsQueryRepository.findColumnById(columnId);
        if (!column) {
            notice.addError('column was not found');
            return notice;
        }
        notice.addData(column);
        return notice;
    }

    async getColumnByIdAndUserId(columnId: string, userId: string) {
        const notice = new InterlayerNotice<ColumnViewDto>();

        const column =
            await this.columnsQueryRepository.findColumnByIdAndUserId(
                columnId,
                userId,
            );
        if (!column) {
            notice.addError('column was not found');
            return notice;
        }
        notice.addData(column);
        return notice;
    }

    async deleteColumn(columnId: string): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const isDeleted = await this.columnsRepository.deleteColumn(columnId);
        if (!isDeleted) {
            notice.addError('column was not deleted');
            return notice;
        }
        return notice;
    }

    async getCardsByColumnId(
        columnId: string,
        query: QueryDto,
    ): Promise<InterlayerNotice<Paginator<CardViewDto>>> {
        const notice = new InterlayerNotice<Paginator<CardViewDto>>();

        const cards = await this.cardsQueryRepository.findCardsByColumnId(
            columnId,
            query,
        );
        if (!cards) {
            notice.addError('cards was not found');
            return notice;
        }
        notice.addData(cards);
        return notice;
    }

    async updateColumn(
        columnInputDto: ColumnInputDto,
        columnId: string,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const isUpdatedColumn = await this.columnsRepository.updateColumn(
            columnInputDto,
            columnId,
        );
        if (!isUpdatedColumn) {
            notice.addError('column was not updated');
        }
        return notice;
    }
}
