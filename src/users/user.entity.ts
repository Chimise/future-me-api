import {Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {Message} from '../messages/message.entity';

export type Role = 'user' | 'admin';


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true})
    password?: string

    @Column({unique: true, nullable: false})
    email: string

    @Column({nullable: true})
    password_reset_token?: string

    @Column({type: 'timestamp', nullable: true})
    password_reset_expires?: string

    @Column({default: false})
    is_email_verified: boolean;

    @Column({nullable: true})
    profile_image?: string

    @Column({nullable: true})
    name?: string

    @Column({length: 10, nullable: true})
    gender?: string

    @Column({nullable: true})
    google_id?: string

    @Column({type: 'varchar', default: 'user'})
    role: Role;

    @OneToMany(() => UserToken, token => token.user)
    tokens: UserToken[];

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[]

    toJSON() {
        const user = this;
        delete user.password;
        //@ts-ignore
        delete user.tokens;
        delete user.password_reset_expires;
        delete user.password_reset_token;
        return user;
    }

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