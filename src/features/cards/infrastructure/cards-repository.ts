import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Card } from '../domain/cards-entity';
import { Columns } from '../../columns/domain/columns-entity';
import { CardInputDto } from '../api/dto/input/card-input-dto';

@Injectable()
export class CardsRepository {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async createCard(
        cardInputDto: CardInputDto,
        columnId: string,
        userId: string,
    ): Promise<Card> {
        const cardsRepository = this.dataSource.getRepository(Card);

        const card = new Card();
        card.createdAt = new Date(new Date().toISOString());
        card.name = cardInputDto.name;
        card.isDeleted = false;
        card.description = cardInputDto.description;
        card.columnId = columnId;
        card.userId = userId;

        return await cardsRepository.save(card);
    }
}
