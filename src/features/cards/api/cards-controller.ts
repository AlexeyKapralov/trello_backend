import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CardInputDto } from './dto/input/card-input-dto';
import { CardsService } from '../application/cards-service';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { CardViewDto } from './dto/output/card-view-dto';
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';
import { CardsWithCommentsViewDto } from './dto/output/cards-with-comments-view-dto';
import { CardUpdateInputDto } from './dto/input/card-update-input-dto';
import { IsOwnerCardGuard } from '../../../common/guards/is-owner-card-guard';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments-query-repository';
import { QueryDto } from '../../../common/dto/query-dto';
import { PaginatorWithCardsDto } from '../../../common/dto/paginator-dto';

@ApiTags('Cards')
@Controller('cards')
export class CardsController {
    constructor(
        private readonly cardService: CardsService,
        private readonly commentsQueryRepository: CommentsQueryRepository,
    ) {}

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
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
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

    @UseGuards(JwtAuthGuard)
    @Get(':cardId')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get card by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns card',
        type: CardsWithCommentsViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async getCardById(
        @Param('cardId', ParseUUIDPipe) cardId: string,
        @CurrentUserId() userId: string,
    ) {
        const cardInterlayer = await this.cardService.findCardById(cardId);
        if (cardInterlayer.hasError()) {
            throw new NotFoundException();
        }
        return cardInterlayer.data;
    }

    @UseGuards(IsOwnerCardGuard)
    @UseGuards(JwtAuthGuard)
    @Put(':cardId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update card info' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Card is update',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'If user is not owner card',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async updateCard(
        @Param('cardId', ParseUUIDPipe) cardId: string,
        @Body() cardUpdateInputDto: CardUpdateInputDto,
        @CurrentUserId() userId: string,
    ) {
        const cardInterlayer = await this.cardService.updateCard(
            cardUpdateInputDto,
            cardId,
        );
        if (cardInterlayer.hasError()) {
            throw new NotFoundException();
        }
    }

    @UseGuards(IsOwnerCardGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':cardId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete card' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Card is delete',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiForbiddenResponse({
        description: 'If user is not owner card',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async deleteCard(
        @Param('cardId', ParseUUIDPipe) cardId: string,
        @CurrentUserId() userId: string,
    ) {
        const cardInterlayer = await this.cardService.deleteCard(cardId);
        if (cardInterlayer.hasError()) {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':cardId/comments')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get comments for card' })
    @ApiQuery({
        name: 'sortBy',
        type: 'string',
        example: 'createdAt',
        required: false,
    })
    @ApiQuery({
        name: 'sortDirection',
        enum: ['asc', 'desc'],
        example: 'desc',
        required: false,
    })
    @ApiQuery({
        name: 'pageNumber',
        type: 'Number',
        example: '1',
        required: false,
    })
    @ApiQuery({
        name: 'pageSize',
        type: 'Number',
        example: '10',
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns comments',
        type: PaginatorWithCardsDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async getCommentsForCard(
        @Param('cardId', ParseUUIDPipe) cardId: string,
        @Query() query: QueryDto,
    ) {
        const cardInterlayer = await this.cardService.findCardById(cardId);
        if (cardInterlayer.hasError()) {
            throw new NotFoundException();
        }

        const comments =
            await this.commentsQueryRepository.findCommentsByCardId(
                query,
                cardId,
            );
        return comments;
    }
}
