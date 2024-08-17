import { Injectable } from '@nestjs/common';
import { LoginInputDto } from '../api/dto/input/login-input-dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { TokenDto } from '../../../common/dto/token-dto';
import { ApiSettings } from '../../../settings/env/api-settings';
import { CryptoService } from '../../../base/services/crypto-service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../users/infrastructure/users-repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async login(
        loginInputDto: LoginInputDto,
    ): Promise<InterlayerNotice<TokenDto>> {
        const notice = new InterlayerNotice<TokenDto>();

        const user = await this.userRepository.findUserByEmail(
            loginInputDto.email,
        );
        if (!user) {
            notice.addError('user did not find');
            return notice;
        }

        const isPasswordValid = await this.cryptoService.comparePasswordHash(
            loginInputDto.password,
            user.password,
        );
        if (!isPasswordValid) {
            notice.addError('password is not valid');
            return notice;
        }

        const apiSettings = this.configService.get<ApiSettings>('apiSettings', {
            infer: true,
        });
        const accessTokenExpLive = apiSettings.ACCESS_TOKEN_EXPIRATION_LIVE;

        const accessToken = this.jwtService.sign(
            { userId: user.id },
            { expiresIn: accessTokenExpLive },
        );

        notice.addData({ accessToken });

        return notice;
    }

    async authUser(authBody: LoginInputDto): Promise<InterlayerNotice<string>> {
        const notice = new InterlayerNotice<string>();
        const user = await this.userRepository.findUserByEmail(authBody.email);

        if (!user) {
            notice.addError('user did not find');
            return notice;
        }

        const isValidPassword: boolean =
            await this.cryptoService.comparePasswordHash(
                authBody.password,
                user.password,
            );

        if (isValidPassword) {
            notice.addData(user.id);
            return notice;
        }
        return null;
    }
}
