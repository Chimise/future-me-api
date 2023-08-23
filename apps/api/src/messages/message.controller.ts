import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { JwtGuard } from "../common/guard/jwt.guard"
import { CreateMessageDto } from "./dto";
import { DateService } from "./date.service";
import { MessageService } from "./message.service";
import { UserInfo } from "../common/decorators/user.decorator";
import { User } from "../users/user.entity";
import { AllowSession } from "../common/decorators/user.decorator";

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
constructor(private dateService: DateService, private messageService: MessageService) {}

    @AllowSession()
    @Post('schedule')
    async scheduleMessage(@UserInfo() user: User, @Body() body: CreateMessageDto) {
        const scheduledDate = this.dateService.convertToTimestamp(body.date);
        const scheduledDateUtc = this.dateService.convertDateToUTC(body.date, body.timezone);
        const message = await this.messageService.create(user, {scheduled_date: scheduledDate, scheduled_date_utc: scheduledDateUtc, content: body.content, timezone: body.timezone})
        return message;
    }
}