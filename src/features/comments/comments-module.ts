import { Module } from '@nestjs/common';
import { CommentsController } from './api/comments-controller';
import { CommentsService } from './application/comments-service';
import { CommentsRepository } from './infrastructure/comments-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './domain/comments-entity';
import { CardsQueryRepository } from '../cards/infrastructure/cards-query-repository';
import { CommentsQueryRepository } from './infrastructure/comments-query-repository';

@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    controllers: [CommentsController],
    providers: [
        CommentsService,
        CommentsRepository,
        CardsQueryRepository,
        CommentsQueryRepository,
    ],
    exports: [CommentsService],
})
export class CommentsModule {}
