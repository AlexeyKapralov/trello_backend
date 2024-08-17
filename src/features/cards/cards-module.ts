import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './domain/cards-entity';
import { CardsRepository } from './infrastructure/cards-repository';
import { CardsService } from './application/cards-service';
import { CardsController } from './api/cards-controller';
import { CardsQueryRepository } from './infrastructure/cards-query-repository';
import { CommentsModule } from '../comments/comments-module';
import { CommentsQueryRepository } from '../comments/infrastructure/comments-query-repository';

@Module({
    imports: [TypeOrmModule.forFeature([Card]), CommentsModule],
    providers: [
        CardsRepository,
        CardsService,
        CardsQueryRepository,
        CommentsQueryRepository,
    ],
    controllers: [CardsController],
    exports: [CardsService, CardsQueryRepository],
})
export class CardsModule {}
