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
    Patch,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ColumnsService } from '../application/columns-service';
import { ColumnInputDto } from './dto/input/column-input-dto';
import { JwtLocalService } from '../../../base/services/jwt-local-service';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { ColumnViewDto } from './dto/output/column-view-dto';
import { ColumnWithAllInfoViewDto } from './dto/output/column-with-all-info-view-dto';
import { IsOwnerColumnGuard } from '../../../common/guards/is-owner-column-guard';

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
        type: ColumnWithAllInfoViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
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
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success',
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    async getCardsByColumnId(
        @Param('columnId', ParseUUIDPipe) columnId: string,
    ) {
        const columnInterlayer =
            await this.columnsService.getCardsByColumnId(columnId);

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
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
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
