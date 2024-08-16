import { Injectable } from '@nestjs/common';
import { CardsRepository } from '../infrastructure/cards-repository';
import { CardInputDto } from '../api/dto/input/card-input-dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { CardViewDto } from '../api/dto/output/card-view-dto';
import { cardToCardDtoMapper } from '../../../base/mappers/card-view-mapper';

@Injectable()
export class CardsService {
    constructor(private readonly cardsRepository: CardsRepository) {}

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
}
