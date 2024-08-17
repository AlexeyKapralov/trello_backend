import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../../features/comments/infrastructure/comments-query-repository';

@Injectable()
export class IsOwnerCommentGuard implements CanActivate {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const userId = request.user.id;
            const commentId = request.params.commentId;

            if (
                commentId.length !== 36 ||
                !commentId.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                )
            ) {
                throw new BadRequestException({
                    message: 'comment id must be uuid',
                    field: 'commentId',
                });
            }

            let commentById =
                await this.commentsQueryRepository.findCommentById(commentId);
            if (!commentById) {
                throw new NotFoundException();
            }

            let commentByIdAndUserId =
                await this.commentsQueryRepository.findCommentByIdAndUserId(
                    commentId,
                    userId,
                );
            if (!commentByIdAndUserId) {
                throw new ForbiddenException();
            }
            return true;
        }
        return false;
    }
}
