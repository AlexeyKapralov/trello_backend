import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth-service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const userInterlayer = await this.authService.authUser({
            password: password,
            email: username,
        });

        if (!userInterlayer.hasError()) {
            throw new UnauthorizedException();
        }

        return {
            id: userInterlayer.data,
        };
    }
}
