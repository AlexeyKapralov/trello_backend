import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/interlayer';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Columns } from '../../../columns/domain/columns-entity';
import { columnToColumnDtoMapper } from '../../../../base/mappers/column-view-mapper';
import { ColumnViewDto } from '../../../columns/api/dto/output/column-view-dto';

export class FindColumnsQueryPayload implements IQuery {
    constructor(public userId: string) {}
}

@QueryHandler(FindColumnsQueryPayload)
export class FindColumnsQuery
    implements
        IQueryHandler<
            FindColumnsQueryPayload,
            InterlayerNotice<ColumnViewDto[]>
        >
{
    constructor(@InjectDataSource() private dataSource: DataSource) {}
    async execute(
        queryPayload: FindColumnsQueryPayload,
    ): Promise<FindColumnsQueryResultType> {
        const columns = await this.dataSource
            .getRepository(Columns)
            .createQueryBuilder('columns')
            .where('columns.userId = :id', { id: queryPayload.userId })
            .andWhere('columns.isDeleted = :status', { status: false })
            .getMany();

        const notice = new InterlayerNotice<ColumnViewDto[]>();

        notice.addData(columns.map((c) => columnToColumnDtoMapper(c)));

        return notice;
    }
}

export type FindColumnsQueryResultType = InterlayerNotice<ColumnViewDto[]>;
