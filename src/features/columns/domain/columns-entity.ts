import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../users/domain/users-entity';
import { Card } from '../../cards/domain/cards-entity';

@Entity()
export class Columns {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        collation: 'C',
    })
    name: string;

    @Column({
        collation: 'C',
    })
    description: string;

    @Column()
    userId: string;

    @Column()
    createdAt: Date;

    @Column({ default: false })
    @Exclude()
    isDeleted: boolean;

    @ManyToOne(() => User, (users) => users.columns)
    user: User;

    @OneToMany(() => Card, (cards) => cards.column)
    cards: Card[];
}
