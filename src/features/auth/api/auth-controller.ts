import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ThrottlerBehindProxyGuard } from './guards/throttle-behind-proxy-guard';
import { LoginInputDto } from './dto/input/login-input-dto';
import { AuthService } from '../application/auth-service';
import {
    ApiBadRequestResponse,
    ApiBasicAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiTooManyRequestsResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserViewDto } from '../../users/api/dto/output/user-view-dto';
import { ApiErrorResult } from '../../../base/models/api-error-result';
import { TokenDto } from '../../../base/models/token-dto';

@UseGuards(ThrottlerBehindProxyGuard)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
}
