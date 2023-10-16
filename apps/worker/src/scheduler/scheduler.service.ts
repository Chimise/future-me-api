import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import { MessageStatus } from "app/shared";
import { Queue } from "bull";
import moment from "moment";
import { DataSource } from "typeorm";
import { Message } from "../message/message.entity";



@Injectable()
export class SchedulerService {
    constructor(private dataSource: DataSource, @InjectQueue('message') private readonly queue: Queue) { }

    @Cron('0 6,12,18 * * *', { name: 'schedule-message', utcOffset: 0 })
    async addMessageToQueue() {
        const messages = await this.getWaitingMessages();
        const scheduledMessages = await this.updateWaitingMessagesToScheduled(messages);
        if (scheduledMessages) {
            const jobs = scheduledMessages.map(message => ({ name: 'sendMessage', data: message }))
            await this.queue.addBulk(jobs);
        }
    }

    async updateWaitingMessagesToScheduled(messages: Message[]) {
        if (!messages.length) {
            return;
        }
        const messageIds = messages.map(msg => msg.id);

        await this.dataSource.createQueryBuilder().update(Message).set({ status: MessageStatus.Scheduled }).whereInIds(messageIds).execute();

        return messages.map(msg => ({ ...msg, status: MessageStatus.Scheduled }));
    }

    getWaitingMessages() {
        const currentDate = moment.utc().toISOString();
        return this.dataSource.createQueryBuilder().from(Message, 'message')
            .where('message.scheduled_date_utc <= :currentDate', { currentDate })
            .andWhere((query) => {
                query.where('message.status = :status', { status: MessageStatus.Waiting }).orWhere('message.status = :failedStatus', { failedStatus: MessageStatus.Failed })
            }).getMany();
    }
}