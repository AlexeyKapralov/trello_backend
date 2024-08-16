import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../users/domain/users-entity';
import { Comment } from '../../comments/domain/comments-entity';
import { Columns } from '../../columns/domain/columns-entity';

@Entity()
export class Card {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Exclude()
    columnId: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    createdAt: Date;

    @Column()
    @Exclude()
    userId: string;

    @Column({ default: true })
    @Exclude()
    isDeleted: boolean;

    @ManyToOne(() => User, (user) => user.cards)
    user: Card;

    @OneToMany(() => Comment, (comment) => comment.card)
    comments: Comment[];

    @ManyToOne(() => Columns, (column) => column.cards)
    column: Columns;
}
