import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { DateService } from "./date.service";
import { MessageService } from "./message.service";
import { MessageController } from "./message.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Message]), AuthModule],
    providers: [DateService, MessageService],
    controllers: [MessageController],
    exports: [MessageService]
})
export class MessageModule {
    
}