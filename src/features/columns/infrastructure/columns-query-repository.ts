import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CryptoService } from '../../../base/services/crypto-service';
import { Columns } from '../domain/columns-entity';

@Injectable()
export class ColumnsQueryRepository {
    constructor(
        @InjectDataSource() private dataSource: DataSource,
        private readonly cryptoService: CryptoService,
    ) {}

    async findColumnById(columnId: string) {
        return await this.dataSource
            .getRepository(Columns)
            .createQueryBuilder('columns')
            .where('columns.id = :columnId', { columnId })
            .leftJoinAndSelect('columns.cards', 'cards')
            .leftJoinAndSelect('cards.comments', 'comments')
            .getOne();
    }

    async findColumnByIdAndUserId(columnId: string, userId: string) {
        return await this.dataSource.getRepository(Columns).findOne({
            where: {
                userId: userId,
                id: columnId,
            },
        });
    }
}
