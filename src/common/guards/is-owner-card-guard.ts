import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CardsService } from '../../features/cards/application/cards-service';

@Injectable()
export class IsOwnerCardGuard implements CanActivate {
    constructor(private cardService: CardsService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const userId = request.user.id;
            const cardId = request.params.cardId;

            if (
                cardId.length !== 36 ||
                !cardId.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                )
            ) {
                throw new BadRequestException({
                    message: 'card id must be uuid',
                    field: 'cardId',
                });
            }

            const cardByIdInterlayer =
                await this.cardService.findCardById(cardId);

            if (cardByIdInterlayer.hasError()) {
                throw new NotFoundException();
            }

            const userInterlayer = await this.cardService.findCardByIdAndUserId(
                cardId,
                userId,
            );

            if (userInterlayer.hasError()) {
                throw new ForbiddenException();
            }
            return true;
        }
        return false;
    }
}
