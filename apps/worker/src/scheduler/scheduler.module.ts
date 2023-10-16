import { Module } from "@nestjs/common";
import { MessageService } from "apps/api/src/messages/message.service";
import { MessageModule } from "../message/message.module";

@Module({
    imports: [MessageModule],
    providers: [MessageService]
})
export class SchedulerModule { }