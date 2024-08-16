import { EnvironmentVariable } from './env-settings';
import { IsString } from 'class-validator';

export class DatabaseSettings {
    constructor(private environmentVariables: EnvironmentVariable) {}
    @IsString()
    POSTGRESQL_TEST_DB_NAME: string =
        this.environmentVariables.POSTGRESQL_TEST_DB_NAME;
    @IsString()
    POSTGRESQL_DB_NAME: string = this.environmentVariables.POSTGRESQL_DB_NAME;
    @IsString()
    DB_PASSWORD: string = this.environmentVariables.DB_PASSWORD;
}
