import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {

    }

    send(email: string, subject: string, content: string) {
        return this.mailerService.sendMail({
            html: content,
            to: email,
            subject
        })
    }
}