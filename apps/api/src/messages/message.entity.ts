import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { User } from '../users/user.entity';
import { MessageType, MessageStatus } from './dto';


@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.messages, {onDelete: 'CASCADE', nullable: true})
    user: User

    @Column('timestamp')
    scheduled_date_utc: string

    @Column('timestamp')
    scheduled_date: string;

    @Column()
    timezone: string;

    @Column({type: 'varchar', default: MessageType.Email})
    type: MessageType;

    @Column()
    content: string;

    @Column({type: 'varchar', default: MessageStatus.Waiting})
    status: MessageStatus;
}