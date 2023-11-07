import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AllowSession, UserInfo } from "../common/decorators/user.decorator";
import { JwtGuard } from "../common/guard/jwt.guard";
import { User } from "../users/user.entity";
import { DateService } from "./date.service";
import { CreateMessageDto } from "./dto";
import { MessageService } from "./message.service";

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
    constructor(private dateService: DateService, private messageService: MessageService) { }

    @AllowSession()
    @Post('schedule')
    async scheduleMessage(@UserInfo() user: User, @Body() body: CreateMessageDto) {
        const scheduledDate = this.dateService.convertToTimestamp(body.date);
        const scheduledDateUtc = this.dateService.convertDateToUTC(body.date, body.timezone);
        if (this.dateService.isDateOutdated(scheduledDateUtc)) {
            throw new BadRequestException('Invalid scheduled date, the scheduling date should be in the future')
        }
        const message = await this.messageService.create(user, { scheduled_date: scheduledDate, scheduled_date_utc: scheduledDateUtc, content: body.content, timezone: body.timezone })
        return message;
    }
}