import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { ColumnsService } from '../../features/columns/application/columns-service';

@Injectable()
export class IsOwnerColumnGuard implements CanActivate {
    constructor(private columnsService: ColumnsService) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const userId = request.user.id;
            const columnId = request.params.columnId;

            if (
                columnId.length !== 36 ||
                !columnId.match(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
                )
            ) {
                throw new BadRequestException({
                    message: 'column id must be uuid',
                    field: 'columnId',
                });
            }

            const userInterlayer =
                await this.columnsService.getColumnByIdAndUserId(
                    columnId,
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
