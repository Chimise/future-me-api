import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { MessageStatus, MessageType } from './message.types';


export abstract class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('timestamp')
    scheduled_date_utc: string

    @Column('timestamp')
    scheduled_date: string;

    @Column()
    timezone: string;

    @Column({ type: 'varchar', default: MessageType.Email })
    type: MessageType;

    @Column()
    content: string;

    @Column({ type: 'varchar', default: MessageStatus.Waiting })
    status: MessageStatus;
}