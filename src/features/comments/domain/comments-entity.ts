import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/domain/users-entity';
import { Card } from '../../cards/domain/cards-entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Exclude()
    cardId: string;

    @Column()
    text: string;

    @Column()
    userId: string;

    @Column()
    createdAt: Date;

    @Column()
    @Exclude()
    isDeleted: boolean;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Card, (card) => card.comments)
    card: Card;
}
