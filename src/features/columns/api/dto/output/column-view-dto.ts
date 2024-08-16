import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ColumnViewDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({
        example: 'Column name',
    })
    name: string;
    @ApiPropertyOptional({
        example: 'Column description',
    })
    description: string;
    @ApiPropertyOptional({
        example: '2011-10-05T14:48:00.000Z',
    })
    createdAt: string;
}
