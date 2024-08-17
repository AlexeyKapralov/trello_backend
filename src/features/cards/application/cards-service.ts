import { Injectable } from '@nestjs/common';
import { CardsRepository } from '../infrastructure/cards-repository';
import { CardInputDto } from '../api/dto/input/card-input-dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { CardViewDto } from '../api/dto/output/card-view-dto';
import { cardToCardDtoMapper } from '../../../base/mappers/card-view-mapper';
import { CardsWithCommentsViewDto } from '../api/dto/output/cards-with-comments-view-dto';
import { CardsQueryRepository } from '../infrastructure/cards-query-repository';
import { Card } from '../domain/cards-entity';
import { CardUpdateInputDto } from '../api/dto/input/card-update-input-dto';

@Injectable()
export class CardsService {
    constructor(
        private readonly cardsRepository: CardsRepository,
        private readonly cardsQueryRepository: CardsQueryRepository,
    ) {}

    async createCard(
        cardInputDto: CardInputDto,
        columnId: string,
        userId: string,
    ): Promise<InterlayerNotice<CardViewDto>> {
        const notice = new InterlayerNotice<CardViewDto>();

        const card = await this.cardsRepository.createCard(
            cardInputDto,
            columnId,
            userId,
        );
        if (!card) {
            notice.addError('card was not created');
            return notice;
        }

        notice.addData(cardToCardDtoMapper(card));
        return notice;
    }

    async findCardById(cardId: string): Promise<InterlayerNotice<Card>> {
        const notice = new InterlayerNotice<Card>();

        const card =
            await this.cardsQueryRepository.findCardWithCommentsById(cardId);
        if (!card) {
            notice.addError('card was not found');
            return notice;
        }
        notice.addData(card);
        return notice;
    }

    async findCardByIdAndUserId(
        cardId: string,
        userId: string,
    ): Promise<InterlayerNotice<CardViewDto>> {
        const notice = new InterlayerNotice<CardViewDto>();

        const card = await this.cardsQueryRepository.findCardByCardIdAndUserId(
            cardId,
            userId,
        );
        if (!card) {
            notice.addError('card was not found');
            return notice;
        }
        notice.addData(card);
        return notice;
    }

    async updateCard(
        cardUpdateInputDto: CardUpdateInputDto,
        cardId: string,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const card = await this.cardsQueryRepository.findCardById(cardId);
        if (!card) {
            notice.addError('card was not found');
            return notice;
        }
        const isCardUpdate = await this.cardsRepository.updateCard(
            cardUpdateInputDto,
            cardId,
        );
        if (!isCardUpdate) {
            notice.addError('card was not updated');
            return notice;
        }
        return notice;
    }

    async deleteCard(cardId: string): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const card = await this.cardsQueryRepository.findCardById(cardId);
        if (!card) {
            notice.addError('card was not found');
            return notice;
        }
        const isCardDelete = await this.cardsRepository.deleteCard(cardId);
        if (!isCardDelete) {
            notice.addError('card was not deleted');
            return notice;
        }
        return notice;
    }
}
