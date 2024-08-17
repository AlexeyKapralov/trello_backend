import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TokenDto {
    @ApiProperty()
    accessToken: string;
}
