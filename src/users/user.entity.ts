import {Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {Message} from '../messages/message.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true})
    password?: string

    @Column({unique: true})
    email: string

    @Column({default: false})
    is_email_verified: boolean;

    @Column({nullable: true})
    google?: string;

    @Column({type: 'varchar', enum: ['user', 'admin'], default: 'user'})
    role: string;

    @OneToMany(() => UserToken, token => token.user)
    tokens: UserToken[];

    @OneToMany(() => Message, (message) => message.user, {eager: false})
    messages: Message[]
}


@Entity()
export class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    access_token: string;

    @Column({length: 20})
    kind: string;

    @ManyToOne(() => User, user => user.tokens)
    user: User
}