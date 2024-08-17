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
    Query,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { UserInputDto } from './dto/input/user-input-dto';
import { UsersService } from '../application/users-service';
import {
    ApiBadRequestResponse,
    ApiBasicAuth,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserViewDto } from './dto/output/user-view-dto';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { LocalAuthGuard } from '../../auth/api/guards/local-auth-guard';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth-guard';
import { QueryBus } from '@nestjs/cqrs';
import { InterlayerNotice } from '../../../base/models/interlayer';
import {
    FindColumnsQueryPayload,
    FindColumnsQueryResultType,
} from '../infrastructure/queries/get-columns-query';
import { AuthGuard } from '@nestjs/passport';
import {
    FindCardsQueryPayload,
    FindCardsQueryResultType,
} from '../../cards/infrastructure/queries/get-cards-query';
import { QueryDto } from '../../../common/dto/query-dto';
import { PaginatorWithCardsDto } from '../../../common/dto/paginator-dto';
import { ColumnViewDto } from '../../columns/api/dto/output/column-view-dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        //шина для query
        private readonly queryBus: QueryBus,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post()
    @ApiBasicAuth()
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the newly created user',
        type: UserViewDto,
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
    async createUser(@Body() userBody: UserInputDto) {
        const createdUserInterlayer =
            await this.userService.createUser(userBody);

        if (createdUserInterlayer.hasError()) {
            throw new BadRequestException(
                createdUserInterlayer.extensions.map((error) => {
                    return {
                        message: error.message,
                        field: error.key,
                    };
                }),
            );
        }

        return createdUserInterlayer.data;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/columns')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find columns for user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns all columns',
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
    async getColumnsForUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const payload = new FindColumnsQueryPayload(userId);

        const findResult = await this.queryBus.execute<
            FindColumnsQueryPayload,
            InterlayerNotice<FindColumnsQueryResultType>
        >(payload);

        return findResult.data;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find user by id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User will be return',
        type: UserViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiNotFoundResponse({
        description: 'If user did not exist',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async getUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const userInterlayer = await this.userService.findUserById(userId);

        if (userInterlayer.hasError()) {
            throw new NotFoundException();
        }

        return userInterlayer.data;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/cards')
    @ApiBearerAuth()
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
    @ApiOperation({ summary: 'Find cards for user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns all cards',
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
    async getCardsForUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Query() query: QueryDto,
    ) {
        const payload = new FindCardsQueryPayload(userId, query);

        const findResult = await this.queryBus.execute<
            FindCardsQueryPayload,
            InterlayerNotice<FindCardsQueryResultType>
        >(payload);

        return findResult.data;
    }

    @UseGuards(AuthGuard('basic'))
    @Delete(':userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBasicAuth()
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'No Content',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const userInterlayer = await this.userService.deleteUserById(userId);

        if (userInterlayer.hasError()) {
            throw new UnauthorizedException();
        }
    }
}
