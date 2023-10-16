import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MessageProcessor } from "./message.processor";


@Module({
    imports: [BullModule.registerQueue({
        name: 'message',
    })],
    providers: [MessageProcessor]
})
export class MessageModule { }