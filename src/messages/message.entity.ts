import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from 'src/users/user.entity';

type MessageType = 'email' | 'audio' | 'video';

type MessageStatus = 'waiting' | 'scheduled' | 'sent' | 'failed'

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.messages, {onDelete: 'CASCADE', nullable: true})
    user: User

    @Column('date')
    scheduled_date_utc: string

    @Column('date')
    scheduled_date: string;

    @Column()
    timezone: string;

    @Column({type: 'varchar', default: 'email'})
    type: MessageType;

    @Column()
    content: string;

    @Column({type: 'varchar', default: 'waiting'})
    status: MessageStatus;
}