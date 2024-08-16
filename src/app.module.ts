import { Global, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, {
    ConfigurationType,
    validate,
} from './settings/env/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './features/users/api/users-controller';
import { UsersService } from './features/users/application/users-service';
import { UsersRepository } from './features/users/infrastructure/users-repository';
import { UsersModule } from './features/users/users-module';
import { AuthModule } from './features/auth/auth-module';
import { AuthController } from './features/auth/api/auth-controller';
import { ColumnsModule } from './features/columns/columns-module';
import { PassportModule } from '@nestjs/passport';
import { CardsModule } from './features/cards/cards-module';
import { CommentsModule } from './features/comments/comments-module';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 10000,
                limit: 5,
            },
        ]),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService<ConfigurationType>) => {
                const environmentSettings = configService.get(
                    'environmentSettings',
                    { infer: true },
                );
                const databaseSettings = configService.get('databaseSettings', {
                    infer: true,
                });

                const database = environmentSettings.isTesting
                    ? databaseSettings.POSTGRESQL_TEST_DB_NAME
                    : databaseSettings.POSTGRESQL_DB_NAME;

                const dbPassword = databaseSettings.DB_PASSWORD;

                return {
                    type: 'postgres',
                    host: 'localhost', //'127.0.0.1',
                    username: 'postgres',
                    password: dbPassword,
                    database: database,
                    port: 5432,
                    autoLoadEntities: true, //false в продакшене и для raw_sql только
                    synchronize: true, //false в продакшене и для raw_sql только
                };
            },
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate: validate,
            ignoreEnvFile: false, //для development
            envFilePath: ['.env'],
        }),
        UsersModule,
        ColumnsModule,
        AuthModule,
        CardsModule,
        CommentsModule,
        PassportModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
