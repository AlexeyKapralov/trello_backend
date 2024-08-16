import { IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim-decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ColumnInputDto {
    @ApiProperty({
        example: 'Column name',
    })
    @IsString()
    @Trim()
    @Length(1, 30)
    name: string;
    @ApiPropertyOptional({
        example: 'Column description',
    })
    @IsString()
    @Trim()
    @Length(0, 30)
    description: string;
}
