import { Injectable } from '@nestjs/common';
import { UserInputDto } from '../api/dto/input/user-input-dto';
import {
    InterlayerNotice,
    InterlayerStatuses,
} from '../../../base/models/interlayer';
import { UsersQueryRepository } from '../infrastructure/users-query-repository';
import { User } from '../domain/users-entity';
import { UsersRepository } from '../infrastructure/users-repository';
import { UserViewDto } from '../api/dto/output/user-view-dto';

@Injectable()
export class UsersService {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
    ) {}

    async createUser(
        userInputBody: UserInputDto,
    ): Promise<InterlayerNotice<User | null>> {
        const notice = new InterlayerNotice<User>();
        const userByEmail = await this.usersQueryRepository.findUserByEmail(
            userInputBody.email,
        );
        const userByLogin = await this.usersQueryRepository.findUserByLogin(
            userInputBody.login,
        );
        if (userByEmail) {
            notice.addError(
                'email already exists',
                'email',
                InterlayerStatuses.BAD_REQUEST,
            );
        }
        if (userByLogin) {
            notice.addError(
                'login already exists',
                'login',
                InterlayerStatuses.BAD_REQUEST,
            );
        }
        if (notice.hasError()) {
            return notice;
        }

        const user = await this.usersRepository.createUser(userInputBody);
        notice.addData(user);

        return notice;
    }

    async findUserById(userId: string): Promise<InterlayerNotice<UserViewDto>> {
        const notice = new InterlayerNotice<UserViewDto>();
        const user = await this.usersQueryRepository.findUserById(userId);
        if (!user) {
            notice.addError(
                'email already exists',
                'email',
                InterlayerStatuses.BAD_REQUEST,
            );
            return notice;
        }

        notice.addData(user);
        return notice;
    }

    async deleteUserById(userId: string) {
        const notice = new InterlayerNotice();
        const isDeleteUser =
            await this.usersQueryRepository.deleteUserById(userId);
        if (!isDeleteUser) {
            notice.addError('user did not delete');
            return notice;
        }

        return notice;
    }
}
