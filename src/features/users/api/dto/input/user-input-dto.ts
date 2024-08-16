import {
    IsEmail,
    IsString,
    IsStrongPassword,
    Length,
    Matches,
} from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInputDto {
    @ApiProperty({
        example: 'login',
    })
    @Trim()
    @Length(3, 20)
    @IsString()
    @Matches('^[a-zA-Z0-9_-]*$')
    login: string;

    @ApiProperty({
        example: 'Qnyu12as72!',
    })
    @Trim()
    @IsStrongPassword()
    @Length(6, 20)
    @IsString()
    password: string;

    @ApiProperty({
        example: 'purrweb@mail.ru',
    })
    @Trim()
    @IsEmail()
    @IsString()
    email: string;
}
