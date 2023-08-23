import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private emailService: EmailService) { }

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('email')
  async sendEmail() {
    try {
      const isSent = await this.emailService.send('chimiseprosom@gmail.com', 'Test Email', 'Testing');
      return isSent;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
