import { IsNumber, IsString, Matches } from 'class-validator';
import { EnvironmentVariable } from './env-settings';

export class ApiSettings {
    constructor(private environmentVariables: EnvironmentVariable) {}
    @IsNumber()
    PORT: number = Number(this.environmentVariables.PORT);
    @IsString()
    SECRET: string = this.environmentVariables.SECRET;
    @IsString()
    ADMIN_USERNAME: string = this.environmentVariables.ADMIN_USERNAME;
    @IsString()
    ADMIN_PASSWORD: string = this.environmentVariables.ADMIN_PASSWORD;
    @Matches('\\d+(?: days|m|s)')
    ACCESS_TOKEN_EXPIRATION_LIVE: string =
        this.environmentVariables.ACCESS_TOKEN_EXPIRATION_LIVE;
}
