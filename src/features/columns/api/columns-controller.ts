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
import { ColumnsService } from '../application/columns-service';
import { ColumnInputDto } from './dto/input/column-input-dto';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';
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
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { ColumnViewDto } from './dto/output/column-view-dto';
import { ColumnWithAllInfoViewDto } from './dto/output/column-with-all-info-view-dto';
import { IsOwnerColumnGuard } from '../../../common/guards/is-owner-column-guard';
import { CardViewDto } from '../../cards/api/dto/output/card-view-dto';
import { PaginatorWithCardsDto } from '../../../common/dto/paginator-dto';
import { QueryDto } from '../../../common/dto/query-dto';

@ApiTags('Columns')
@Controller('columns')
export class ColumnsController {
    constructor(private columnsService: ColumnsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create column for user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the newly created column',
        type: ColumnViewDto,
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
    async createColumn(
        @Body() columnInputDto: ColumnInputDto,
        @CurrentUserId() userId: string,
    ) {
        const createdColumnInterlayer = await this.columnsService.createColumn(
            columnInputDto,
            userId,
        );

        if (createdColumnInterlayer.hasError()) {
            throw new BadRequestException(
                createdColumnInterlayer.extensions.map((error) => {
                    return {
                        message: error.message,
                        field: error.key,
                    };
                }),
            );
        }

        return createdColumnInterlayer.data;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':columnId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find column by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns found column',
        type: ColumnViewDto,
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
    async getColumnById(@Param('columnId', ParseUUIDPipe) columnId: string) {
        const columnInterlayer =
            await this.columnsService.getColumnById(columnId);

        if (columnInterlayer.hasError()) {
            throw new NotFoundException();
        }

        return columnInterlayer.data;
    }

    @UseGuards(IsOwnerColumnGuard)
    @UseGuards(JwtAuthGuard)
    @Delete(':columnId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete column' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'No Content',
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
    async deleteColumnById(@Param('columnId', ParseUUIDPipe) columnId: string) {
        const columnInterlayer =
            await this.columnsService.deleteColumn(columnId);

        if (columnInterlayer.hasError()) {
            throw new NotFoundException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':columnId/cards')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get cards by column id' })
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
        description: 'Success',
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
    async getCardsByColumnId(
        @Param('columnId', ParseUUIDPipe) columnId: string,
        @Query() query: QueryDto,
    ) {
        const columnInterlayer = await this.columnsService.getCardsByColumnId(
            columnId,
            query,
        );

        if (columnInterlayer.hasError()) {
            throw new NotFoundException();
        }
        return columnInterlayer.data;
    }

    @UseGuards(IsOwnerColumnGuard)
    @UseGuards(JwtAuthGuard)
    @Put(':columnId')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update column info' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'No Content',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiForbiddenResponse({
        description: 'If user is not owner of column',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async updateColumn(
        @Body() columnInputDto: ColumnInputDto,
        @Param('columnId', ParseUUIDPipe) columnId: string,
    ) {
        const columnInterlayer = await this.columnsService.updateColumn(
            columnInputDto,
            columnId,
        );

        if (columnInterlayer.hasError()) {
            throw new NotFoundException();
        }
        return columnInterlayer.data;
    }
}
