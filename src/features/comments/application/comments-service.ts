import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments-repository';
import { CommentInputDto } from '../api/dto/input/comment-input-dto';
import { CommentViewDto } from '../api/dto/output/comment-view-dto';
import {
    InterlayerNotice,
    InterlayerStatuses,
} from '../../../base/models/interlayer';
import { commentToCommentDtoMapper } from '../../../base/mappers/comment-view-mapper';
import { CardsQueryRepository } from '../../cards/infrastructure/cards-query-repository';

@Injectable()
export class CommentsService {
    constructor(
        private commentsRepository: CommentsRepository,
        private cardsQueryRepository: CardsQueryRepository,
    ) {}

    async createComment(
        commentInputDto: CommentInputDto,
        userId: string,
        cardId: string,
    ): Promise<InterlayerNotice<CommentViewDto>> {
        const notice = new InterlayerNotice<CommentViewDto>();

        const card = this.cardsQueryRepository.findCardById(cardId);
        if (!card) {
            notice.addError(
                'card was not found',
                'card',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        const comment = await this.commentsRepository.createComment(
            commentInputDto,
            userId,
            cardId,
        );
        if (!comment) {
            notice.addError(
                'comment was not created',
                'comment',
                InterlayerStatuses.BAD_REQUEST,
            );
            return notice;
        }
        notice.addData(commentToCommentDtoMapper(comment));
        return notice;
    }
}
