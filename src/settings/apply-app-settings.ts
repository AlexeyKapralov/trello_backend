import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import {
    BadRequestException,
    ClassSerializerInterceptor,
    ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exception-filters/http-exception-filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

export const applyAppSettings = (app: NestExpressApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Trello')
        .setDescription('Trello API description for test task')
        .setVersion('1.0')
        .addSecurity('basic', {
            type: 'http',
            scheme: 'basic',
        })
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors();
    app.set('trust proxy', true);

    // Для внедрения зависимостей в validator constraint
    // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
    // когда DI не имеет необходимого класса.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const errorsForResponse = [];

                errors.forEach((e) => {
                    const constrainsKeys = Object.keys(e.constraints);
                    constrainsKeys.forEach((ckey) => {
                        errorsForResponse.push({
                            message: e.constraints[ckey],
                            field: e.property,
                        });
                    });
                });

                throw new BadRequestException(errorsForResponse);
            },
        }),
    );
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
};
