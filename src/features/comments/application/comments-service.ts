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
                'comment was not found',
                'comment',
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

    async deleteComment(
        commentId: string,
    ): Promise<InterlayerNotice<CommentViewDto>> {
        const notice = new InterlayerNotice();

        const comment = await this.commentsRepository.getComment(commentId);
        if (!comment) {
            notice.addError(
                'comment was not found',
                'comment',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        const isDeleteComment =
            await this.commentsRepository.deleteComment(commentId);
        if (!isDeleteComment) {
            notice.addError(
                'comment was not deleted',
                'comment',
                InterlayerStatuses.BAD_REQUEST,
            );
            return notice;
        }
        return notice;
    }

    async getComment(
        commentId: string,
    ): Promise<InterlayerNotice<CommentViewDto>> {
        const notice = new InterlayerNotice<CommentViewDto>();

        const comment = await this.commentsRepository.getComment(commentId);
        if (!comment) {
            notice.addError(
                'comment was not found',
                'comment',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        notice.addData(commentToCommentDtoMapper(comment));
        return notice;
    }

    async updateComment(
        commentId: string,
        commentInputDto: CommentInputDto,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const comment = await this.commentsRepository.getComment(commentId);
        if (!comment) {
            notice.addError(
                'comment was not found',
                'comment',
                InterlayerStatuses.NOT_FOUND,
            );
            return notice;
        }

        const isUpdateComment = await this.commentsRepository.updateComment(
            commentId,
            commentInputDto,
        );
        if (!isUpdateComment) {
            notice.addError('comment was not updated');
            return notice;
        }
        return notice;
    }
}
