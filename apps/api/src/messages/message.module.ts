import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { DateService } from "./date.service";
import { MessageController } from "./message.controller";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";
import { MessageSubscriber } from "./message.subscriber";

@Module({
    imports: [TypeOrmModule.forFeature([Message]), AuthModule, BullModule.registerQueue({
        name: 'message'
    })],
    providers: [DateService, MessageService, MessageSubscriber],
    controllers: [MessageController],
    exports: [MessageService]
})
export class MessageModule {

}