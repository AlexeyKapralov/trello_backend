import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../domain/users-entity';
import { UserViewDto } from '../api/dto/output/user-view-dto';
import { userToUserDtoMapper } from '../../../base/mappers/user-view-mapper';

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async findUserByEmail(email: string): Promise<UserViewDto> {
        const userRepository = this.dataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: {
                email: email,
                isDeleted: false,
            },
        });

        return user ? userToUserDtoMapper(user) : null;
    }

    async findUserById(id: string): Promise<UserViewDto> {
        const userRepository = this.dataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });

        return user ? userToUserDtoMapper(user) : null;
    }

    async findUserByLogin(login: string): Promise<UserViewDto> {
        const userRepository = this.dataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: {
                login: login,
                isDeleted: false,
            },
        });

        return user ? userToUserDtoMapper(user) : null;
    }

    async deleteUserById(id: string): Promise<boolean> {
        const userRepository = this.dataSource.getRepository(User);

        const user = await userRepository.update(
            {
                id: id,
                isDeleted: false,
            },
            { isDeleted: true },
        );

        return user.affected === 1;
    }
}
