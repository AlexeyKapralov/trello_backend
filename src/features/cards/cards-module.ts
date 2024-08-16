import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './domain/cards-entity';
import { CardsRepository } from './infrastructure/cards-repository';
import { CardsService } from './application/cards-service';
import { CardsController } from './api/cards-controller';
import { CardsQueryRepository } from './infrastructure/cards-query-repository';

@Module({
    imports: [TypeOrmModule.forFeature([Card])],
    providers: [CardsRepository, CardsService, CardsQueryRepository],
    controllers: [CardsController],
    exports: [CardsService],
})
export class CardsModule {}
