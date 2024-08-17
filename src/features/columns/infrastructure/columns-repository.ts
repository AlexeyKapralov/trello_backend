import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CryptoService } from '../../../base/services/crypto-service';
import { ColumnInputDto } from '../api/dto/input/column-input-dto';
import { Columns } from '../domain/columns-entity';
import { Card } from '../../cards/domain/cards-entity';

@Injectable()
export class ColumnsRepository {
    constructor(
        @InjectDataSource() private dataSource: DataSource,
        private readonly cryptoService: CryptoService,
    ) {}

    async createColumn(
        columnInputBody: ColumnInputDto,
        userId: string,
    ): Promise<Columns> {
        const columnsRepository = this.dataSource.getRepository(Columns);

        const column = new Columns();
        column.createdAt = new Date(new Date().toISOString());
        column.userId = userId;
        column.isDeleted = false;
        column.description = columnInputBody.description;
        column.name = columnInputBody.name;

        return await columnsRepository.save(column);
    }

    async deleteColumn(columnId: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(Columns).update(
                {
                    id: columnId,
                    isDeleted: false,
                },
                { isDeleted: true },
            );

            await queryRunner.manager.getRepository(Card).update(
                {
                    columnId: columnId,
                    isDeleted: false,
                },
                { isDeleted: true },
            );

            await queryRunner.manager.query(
                `
                UPDATE comment 
                SET "isDeleted" = True
                WHERE "cardId" IN (
                    SELECT id    
                    FROM public.card
                    WHERE "columnId" = $1
                )
            `,
                [columnId],
            );

            await queryRunner.commitTransaction();
            return true;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return false;
        } finally {
            await queryRunner.release();
        }
    }

    async updateColumn(
        columnInputDto: ColumnInputDto,
        columnId: string,
    ): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.getRepository(Columns).update(
                {
                    id: columnId,
                    isDeleted: false,
                },
                {
                    name: columnInputDto.name,
                    description: columnInputDto.description,
                },
            );

            await queryRunner.commitTransaction();
            return true;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return false;
        } finally {
            await queryRunner.release();
        }
    }
}
