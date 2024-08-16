import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldError } from '../../../../../base/models/api-error-result';
import { CardViewDto } from '../../../../cards/api/dto/output/card-view-dto';
import { CardsWithCommentsViewDto } from '../../../../cards/api/dto/output/cards-with-comments-view-dto';

export class ColumnWithAllInfoViewDto {
    @ApiProperty()
    id: string;
    @ApiProperty({
        example: 'Column name',
    })
    @ApiProperty()
    userId: string;

    name: string;
    @ApiPropertyOptional({
        example: 'Column description',
    })
    description: string;
    @ApiPropertyOptional({
        example: '2011-10-05T14:48:00.000Z',
    })
    createdAt: string;

    @ApiPropertyOptional({ type: [CardsWithCommentsViewDto] })
    cards: [CardsWithCommentsViewDto];
}
