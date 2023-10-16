import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('message')
export class MessageProcessor {
    @Process('sendMessage')
    handleSendMessage(job: Job) {
        console.log(job.data);

    }
}