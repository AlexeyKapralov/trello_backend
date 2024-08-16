import { ColumnsService } from './application/columns-service';
import { ColumnsController } from './api/columns-controller';
import { Module } from '@nestjs/common';
import { ColumnsRepository } from './infrastructure/columns-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Columns } from './domain/columns-entity';
import { UsersModule } from '../users/users-module';
import { CryptoService } from '../../base/services/crypto-service';
import { JwtLocalService } from '../../base/services/jwt-local-service';
import { ColumnsQueryRepository } from './infrastructure/columns-query-repository';
import { CardsQueryRepository } from '../cards/infrastructure/cards-query-repository';

@Module({
    imports: [TypeOrmModule.forFeature([Columns]), UsersModule],
    controllers: [ColumnsController],
    providers: [
        ColumnsService,
        ColumnsRepository,
        ColumnsQueryRepository,
        CardsQueryRepository,
        CryptoService,
        JwtLocalService,
    ],
    exports: [ColumnsService],
})
export class ColumnsModule {}
