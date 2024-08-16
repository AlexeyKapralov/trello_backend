import { isString, IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CardInputDto {
    @ApiPropertyOptional({
        example: 'Card name',
    })
    @IsString()
    @Trim()
    @Length(1, 30)
    name: string;

    @ApiPropertyOptional({
        example: 'Card description',
    })
    @IsString()
    @Trim()
    @Length(1, 30)
    description: string;

    @ApiPropertyOptional()
    @IsString()
    @Length(1, 36)
    columnId: string;
}
