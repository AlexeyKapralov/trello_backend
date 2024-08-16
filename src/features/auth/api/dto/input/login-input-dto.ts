import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    @Length(3, 20)
    email: string;
    @IsString()
    @IsStrongPassword()
    @ApiProperty()
    @Length(3, 100)
    password: string;
}
