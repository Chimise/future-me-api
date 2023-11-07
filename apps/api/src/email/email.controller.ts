import { Body, Controller, HttpException, InternalServerErrorException, Post } from "@nestjs/common";
import { SendEmailDto } from "./dto";
import { EmailService } from "./email.service";

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService) { }

    @Post('test')
    async sendTestEmail(@Body() body: SendEmailDto) {
        try {
            await this.emailService.send(body.email, 'Test email', 'This is a test email');
            return {
                message: 'Email sent successfully'
            }
        } catch (error) {
            console.log(error);
            if (!(error instanceof HttpException)) {
                throw new InternalServerErrorException('Could not send the test email');
            }

            throw error;
        }
    }
}