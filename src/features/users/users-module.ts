import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/users-entity';
import { UsersController } from './api/users-controller';
import { UsersService } from './application/users-service';
import { UsersRepository } from './infrastructure/users-repository';
import { UsersQueryRepository } from './infrastructure/users-query-repository';
import { CryptoService } from '../../base/services/crypto-service';
import { CqrsModule } from '@nestjs/cqrs';
import { FindColumnsQuery } from './infrastructure/queries/get-columns-query';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CqrsModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        UsersRepository,
        UsersQueryRepository,
        CryptoService,
        FindColumnsQuery,
    ],
    exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
