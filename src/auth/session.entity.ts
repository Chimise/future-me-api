import { Entity, Column, PrimaryColumn, DeleteDateColumn } from "typeorm";
import {ISession} from 'connect-typeorm'

@Entity()
export class Session implements ISession {
    @Column('bigint')
    expiredAt = Date.now();

    @PrimaryColumn('varchar')
    id = ''

    @Column('text')
    json = ''

    @DeleteDateColumn()
    destroyedAt?: Date;
}