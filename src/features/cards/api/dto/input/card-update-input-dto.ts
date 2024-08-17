import { isString, IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CardUpdateInputDto {
    @ApiPropertyOptional({
        example: 'New card name',
    })
    @IsString()
    @Trim()
    @Length(1, 30)
    name: string;

    @ApiPropertyOptional({
        example: 'New card description',
    })
    @IsString()
    @Trim()
    @Length(1, 30)
    description: string;
}
