import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ThrottlerBehindProxyGuard } from './guards/throttle-behind-proxy-guard';
import { LoginInputDto } from './dto/input/login-input-dto';
import { AuthService } from '../application/auth-service';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { TokenDto } from '../../../common/dto/token-dto';
import { UserViewDto } from '../../users/api/dto/output/user-view-dto';
import { CurrentUserId } from '../../../common/decorators/validate/current-user-id-decorator';
import { UsersService } from '../../users/application/users-service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

// @UseGuards(ThrottlerBehindProxyGuard)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'Try to login to the system' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns access token',
        type: TokenDto,
    })
    @ApiBadRequestResponse({
        type: ApiErrorResult,
        description: 'If the inputModel has incorrect values',
    })
    @ApiUnauthorizedResponse({
        description: 'If the password or login is wrong',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginInputDto: LoginInputDto) {
        const interlayerTokens = await this.authService.login(loginInputDto);
        if (interlayerTokens.hasError()) {
            throw new UnauthorizedException();
        }

        return {
            accessToken: interlayerTokens.data.accessToken,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get info about current user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns info about user',
        type: UserViewDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized',
    })
    @ApiUnauthorizedResponse({
        description: 'If the password or login is wrong',
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many attempts from one IP-address',
    })
    @HttpCode(HttpStatus.OK)
    async me(@CurrentUserId() userId: string) {
        const userViewDtoInterlayerNotice =
            await this.userService.findUserById(userId);
        if (userViewDtoInterlayerNotice.hasError()) {
            throw new NotFoundException();
        }

        return userViewDtoInterlayerNotice.data;
    }
}
