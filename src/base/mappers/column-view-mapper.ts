import { Columns } from '../../features/columns/domain/columns-entity';
import { ColumnViewDto } from '../../features/columns/api/dto/output/column-view-dto';

export const columnToColumnDtoMapper = (column: Columns): ColumnViewDto => {
    return {
        id: column.id,
        name: column.name,
        description: column.description,
        createdAt: column.createdAt.toISOString(),
        userId: column.userId,
    };
};
