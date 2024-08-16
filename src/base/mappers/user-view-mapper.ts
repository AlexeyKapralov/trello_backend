import { UserViewDto } from '../../features/users/api/dto/output/user-view-dto';
import { User } from '../../features/users/domain/users-entity';

export const userToUserDtoMapper = (user: User): UserViewDto => {
    return {
        id: user.id,
        email: user.email,
        login: user.login,
        createdAt: user.createdAt.toISOString(),
    };
};
