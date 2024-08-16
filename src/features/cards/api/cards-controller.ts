import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CardInputDto } from './dto/input/card-input-dto';
import { CardsService } from '../application/cards-service';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { CardViewDto } from './dto/output/card-view-dto';
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
    constructor(private readonly cardService: CardsService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':columnId')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create card for column' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the newly created card',
        type: CardViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    async createCard(
        @Body() cardInputDto: CardInputDto,
        @Param('columnId') columnId: string,
        @CurrentUserId() userId: string,
    ) {
        const cardInterlayer = await this.cardService.createCard(
            cardInputDto,
            columnId,
            userId,
        );
        if (cardInterlayer.hasError()) {
            throw new BadRequestException();
        }
        return cardInterlayer.data;
    }
}
