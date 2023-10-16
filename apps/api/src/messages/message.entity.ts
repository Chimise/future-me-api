import { Entity, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Message as BaseMessage } from 'app/shared';


@Entity()
export class Message extends BaseMessage {
    @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE', nullable: true })
    user: User

}