import { IsDefined, IsNumber, IsString, Min } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export class QueryDto {
    @IsString()
    sortBy: string = 'createdAt';
    @IsDefined({
        message: 'sortDirection must be one of the following values: asc, desc',
    })
    sortDirection: string = 'desc';
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageNumber: number = 1;
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageSize: number = 10;
}
