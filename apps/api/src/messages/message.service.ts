import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Update } from '../common/types';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

type MessageOrId = string | Message;

@Injectable()
export class MessageService {
    constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) { }

    create(user: User, data: Omit<Message, 'id' | 'type' | 'status' | 'user'>) {
        const message = this.messageRepository.create();
        Object.assign(message, { user: user.id, ...data });
        return this.messageRepository.save(message);
    }

    async findOne(id: string) {
        const message = await this.messageRepository.findOneBy({ id });
        if (!message) {
            throw new NotFoundException('Message not found')
        }
        return message;
    }

    async update(id: MessageOrId, data: Update<Message, 'status' | 'type'>) {
        const message = await this.getMessage(id);
        Object.assign(message, data);
        return await this.messageRepository.save(message);
    }

    async delete(id: MessageOrId) {
        const message = await this.getMessage(id);
        return await this.messageRepository.remove(message);
    }

    private async getMessage(id: MessageOrId) {
        if (id instanceof Message) {
            return id;
        }

        return await this.findOne(id);
    }
}