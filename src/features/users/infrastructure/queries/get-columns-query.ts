import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../../base/models/interlayer';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Columns } from '../../../columns/domain/columns-entity';
import { ColumnWithAllInfoViewDto } from '../../../columns/api/dto/output/column-with-all-info-view-dto';

export class FindColumnsQueryPayload implements IQuery {
    constructor(public userId: string) {}
}

@QueryHandler(FindColumnsQueryPayload)
export class FindColumnsQuery
    implements
        IQueryHandler<
            FindColumnsQueryPayload,
            InterlayerNotice<FindUsersQueryResultType>
        >
{
    constructor(@InjectDataSource() private dataSource: DataSource) {}
    async execute(queryPayload: FindColumnsQueryPayload) {
        const columns = await this.dataSource
            .getRepository(Columns)
            .createQueryBuilder('columns')
            .where('columns.userId = :id', { id: queryPayload.userId })
            .andWhere('columns.isDeleted = :status', { status: false })
            .leftJoinAndSelect('columns.cards', 'cards')
            .leftJoinAndSelect('cards.comments', 'comments')
            .getMany();

        const notice = new InterlayerNotice<FindUsersQueryResultType>();

        notice.addData(columns);

        return notice;

        // let countUsers;
        // try {
        //     countUsers = await this.dataSource.query(
        //         `
        //         SELECT COUNT(*) FROM users
        //         WHERE
        //             "isDeleted" = False AND
        //             (
        //                 LOWER(email) LIKE LOWER($1) OR
        //                 LOWER(login) LIKE LOWER($2)
        //             )
        //     `,
        //         [
        //             `%${queryPayload.searchEmailTerm ? queryPayload.searchEmailTerm : ''}%`,
        //             `%${queryPayload.searchLoginTerm ? queryPayload.searchLoginTerm : ''}%`,
        //         ],
        //     );
        //     countUsers = Number(countUsers[0].count);
        // } catch {
        //     countUsers = 0;
        // }
        //
        // const allowedSortFields = [
        //     'id',
        //     'password',
        //     'email',
        //     'login',
        //     'createdAt',
        // ];
        // let sortBy = `"${queryPayload.sortBy}"`;
        // if (sortBy !== '"createdAt"') {
        //     sortBy = allowedSortFields.includes(queryPayload.sortBy)
        //         ? `"${queryPayload.sortBy}" COLLATE "C" `
        //         : `"createdAt"`;
        // }
        //
        // let sortDirection = SortDirection.DESC;
        // switch (queryPayload.sortDirection) {
        //     case 1:
        //         sortDirection = SortDirection.ASC;
        //         break;
        //     case -1:
        //         sortDirection = SortDirection.DESC;
        //         break;
        // }
        //
        // let users = [];
        // try {
        //     users = await this.dataSource.query(
        //         `
        //         SELECT
        //             id,
        //             email,
        //             login,
        //             "createdAt"
        //         FROM users
        //         WHERE
        //             "isDeleted" = False AND
        //             (
        //                 LOWER(email) LIKE LOWER($1) OR
        //                 LOWER(login) LIKE LOWER($2)
        //             )
        //
        //         ORDER BY ${sortBy} ${sortDirection}
        //         LIMIT $3 OFFSET $4
        //     `,
        //         [
        //             `%${queryPayload.searchEmailTerm ? queryPayload.searchEmailTerm : ''}%`,
        //             `%${queryPayload.searchLoginTerm ? queryPayload.searchLoginTerm : ''}%`,
        //             queryPayload.pageSize,
        //             (queryPayload.pageNumber - 1) * queryPayload.pageSize,
        //         ],
        //     );
        // } catch (e) {
        //     console.log(e);
        // }
        //
        // const usersWithPaginate: Paginator<UserViewDto> = {
        //     pagesCount: Math.ceil(countUsers / queryPayload.pageSize),
        //     page: queryPayload.pageNumber,
        //     pageSize: queryPayload.pageSize,
        //     totalCount: countUsers,
        //     items: users,
        // };
        //
    }
}

// export type FindUsersQueryResultType = Paginator<UserViewDto>;
export type FindUsersQueryResultType = Columns[];
