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
    ApiResponse,
    ApiTags,
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
    FindUsersQueryResultType,
} from '../infrastructure/queries/get-columns-query';
import { IsString } from 'class-validator';
import { ColumnWithAllInfoViewDto } from '../../columns/api/dto/output/column-with-all-info-view-dto';
import { AuthGuard } from '@nestjs/passport';

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
        type: ColumnWithAllInfoViewDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    async getColumnsForUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const payload = new FindColumnsQueryPayload(userId);

        const findResult = await this.queryBus.execute<
            FindColumnsQueryPayload,
            InterlayerNotice<FindUsersQueryResultType>
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
    async getUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const userInterlayer = await this.userService.findUserById(userId);

        if (userInterlayer.hasError()) {
            throw new NotFoundException();
        }

        return userInterlayer.data;
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
    async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const userInterlayer = await this.userService.deleteUserById(userId);

        if (userInterlayer.hasError()) {
            throw new UnauthorizedException();
        }
    }
}
