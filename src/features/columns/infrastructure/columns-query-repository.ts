import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CryptoService } from '../../../base/services/crypto-service';
import { Columns } from '../domain/columns-entity';
import { columnToColumnDtoMapper } from '../../../base/mappers/column-view-mapper';

@Injectable()
export class ColumnsQueryRepository {
    constructor(
        @InjectDataSource() private dataSource: DataSource,
        private readonly cryptoService: CryptoService,
    ) {}

    async findColumnById(columnId: string) {
        const column = await this.dataSource
            .getRepository(Columns)
            .createQueryBuilder('columns')
            .where('columns.id = :columnId', { columnId })
            .andWhere('columns.isDeleted = :isDeleted', { isDeleted: false })
            .getOne();

        return columnToColumnDtoMapper(column);
    }

    async findColumnByIdAndUserId(columnId: string, userId: string) {
        const column = await this.dataSource.getRepository(Columns).findOne({
            where: {
                userId: userId,
                id: columnId,
                isDeleted: false,
            },
        });
        return columnToColumnDtoMapper(column);
    }
}
