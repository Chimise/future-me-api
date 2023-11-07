import { Injectable } from "@nestjs/common";
import * as moment from "moment-timezone";


@Injectable()
export class DateService {
    convertDateToUTC(scheduledDate: string, timezone: string) {
        const dateInUserTz = moment.utc().tz(timezone);
        const date = moment(this.convertToTimestamp(scheduledDate));
        date.set({
            milliseconds: dateInUserTz.get('milliseconds'),
            minutes: dateInUserTz.get('minutes'),
            seconds: dateInUserTz.get('seconds'),
            hours: dateInUserTz.get('hours')
        })

        return date.toISOString();
    }

    convertToTimestamp(date: string) {
        return date.concat('T00:00:00.000Z');
    }

    isDateOutdated(timeStamp: string) {
        const currentDate = moment.utc();
        const scheduledDate = moment.utc(timeStamp);
        const diff = scheduledDate.diff(currentDate, 'days', true);
        return diff <= -1;
    }

}