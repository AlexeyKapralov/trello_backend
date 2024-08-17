import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Card } from '../domain/cards-entity';
import { CardInputDto } from '../api/dto/input/card-input-dto';
import { CardUpdateInputDto } from '../api/dto/input/card-update-input-dto';
import { Columns } from '../../columns/domain/columns-entity';

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

    async updateCard(
        cardUpdateInputDto: CardUpdateInputDto,
        cardId: string,
    ): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cardsRepository = queryRunner.manager.getRepository(Card);

            const card = await cardsRepository.findOne({
                where: {
                    id: cardId,
                    isDeleted: false,
                },
            });

            if (!card) {
                return false;
            }
            if (cardUpdateInputDto.name) {
                card.name = cardUpdateInputDto.name;
            }
            if (cardUpdateInputDto.description) {
                card.description = cardUpdateInputDto.description;
            }

            await cardsRepository.save(card);

            await queryRunner.commitTransaction();
            return true;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return false;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteCard(cardId: string): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const cardsRepository = queryRunner.manager.getRepository(Card);

            const card = await cardsRepository.findOne({
                where: {
                    id: cardId,
                    isDeleted: false,
                },
            });

            if (!card) {
                return false;
            }
            card.isDeleted = true;

            await cardsRepository.save(card);

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
