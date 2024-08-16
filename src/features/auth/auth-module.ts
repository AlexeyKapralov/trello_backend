import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users-module';
import { CryptoService } from '../../base/services/crypto-service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../settings/env/configuration';
import { ApiSettings } from '../../settings/env/api-settings';
import { BasicStrategy } from './strategies/basic-strategy';
import { AuthService } from './application/auth-service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { AuthController } from './api/auth-controller';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService<ConfigurationType>) => {
                const apiSettings = configService.get<ApiSettings>(
                    'apiSettings',
                    { infer: true },
                );
                return {
                    secret: apiSettings.SECRET,
                };
            },
            global: true,
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        BasicStrategy,
        CryptoService,
        AuthService,
        JwtStrategy,
        LocalStrategy,
        BasicStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
