import { InjectQueue } from '@nestjs/bull';
import { MessageStatus } from 'app/shared';
import { Queue } from 'bull';
import * as moment from 'moment';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Message } from "./message.entity";
import { MessageService } from './message.service';

@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
    constructor(dataSource: DataSource, @InjectQueue('message') private readonly messageQueue: Queue<Message>, private readonly messageService: MessageService) {
        dataSource.subscribers.push(this);
    }

    listenTo(): string | Function {
        return Message;
    }

    async afterInsert(event: InsertEvent<Message>): void | Promise<any> {
        const currentDate = moment.utc().format('YYYY-MM-DD');
        const scheduledDate = moment.utc(event.entity.scheduled_date_utc).format('YYYY-MM-DD');
        if (currentDate !== scheduledDate) {
            return;
        }

        const message = await this.messageService.update(event.entity.id, { status: MessageStatus.Scheduled });
        this.messageQueue.add('sendMessage', message);
    }
}

