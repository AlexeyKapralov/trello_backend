import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserInputDto } from '../api/dto/input/user-input-dto';
import { CryptoService } from '../../../base/services/crypto-service';
import { User } from '../domain/users-entity';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectDataSource() private dataSource: DataSource,
        private readonly cryptoService: CryptoService,
    ) {}

    async createUser(userInputBody: UserInputDto): Promise<User> {
        const userRepository = this.dataSource.getRepository(User);

        const user = new User();
        user.createdAt = new Date(new Date().toISOString());
        user.login = userInputBody.login;
        user.email = userInputBody.email;
        user.password = await this.cryptoService.createPasswordHash(
            userInputBody.password,
        );
        user.isDeleted = false;

        return await userRepository.save(user);
    }

    async findUserById(id: string): Promise<User> {
        const userRepository = this.dataSource.getRepository(User);

        return await userRepository.findOne({
            where: {
                id: id,
                isDeleted: false,
            },
        });
    }

    async findUserByEmail(email: string): Promise<User> {
        const userRepository = this.dataSource.getRepository(User);

        return await userRepository.findOne({
            where: {
                email: email,
                isDeleted: false,
            },
        });
    }
}
