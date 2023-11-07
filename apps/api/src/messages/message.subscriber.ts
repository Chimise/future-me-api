import { InjectQueue } from '@nestjs/bull';
import { MessageStatus } from 'app/shared';
import { Queue } from 'bull';
import * as moment from 'moment';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Message } from "./message.entity";

@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
    private dataSource: DataSource;
    constructor(dataSource: DataSource, @InjectQueue('message') private readonly messageQueue: Queue<Message>,) {
        this.dataSource = dataSource;
        dataSource.subscribers.push(this);
    }

    listenTo(): string | Function {
        return Message;
    }

    async afterInsert(event: InsertEvent<Message>): Promise<any> {
        const currentDate = moment.utc().format('YYYY-MM-DD');
        console.log('Current date', currentDate);
        const scheduledDate = moment.utc(event.entity.scheduled_date_utc).format('YYYY-MM-DD');
        console.log('Scheduled date', scheduledDate);
        if (currentDate !== scheduledDate) {
            return;
        }

        console.log(event.entity);
        await this.dataSource.createQueryBuilder().update(Message).set({ status: MessageStatus.Scheduled }).where('id = :id', { id: event.entity.id })
        console.log('Adding to queue');
        this.messageQueue.add('sendMessage', { ...event.entity, status: MessageStatus.Scheduled });
    }
}

