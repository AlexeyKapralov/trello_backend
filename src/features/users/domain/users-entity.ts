import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Columns } from '../../columns/domain/columns-entity';
import { Card } from '../../cards/domain/cards-entity';
import { Comment } from '../../comments/domain/comments-entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        collation: 'C',
    })
    login: string;

    @Column({
        collation: 'C',
    })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    createdAt: Date;

    @Column({ default: false })
    @Exclude()
    isDeleted: boolean;

    @OneToMany(() => Columns, (columns) => columns.user)
    columns: Columns[];

    @OneToMany(() => Card, (card) => card.user)
    cards: Card[];

    @OneToMany(() => Card, (card) => card.user)
    comments: Comment[];
}
