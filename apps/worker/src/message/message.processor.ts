import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('message')
export class MessageProcessor {
    @Process('sendMessage')
    handleSendMessage(job: Job) {
        console.log('Job Running');
        console.log(job.data);
    }
}