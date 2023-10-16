import { Injectable } from "@nestjs/common";
import * as moment from "moment-timezone";


@Injectable()
export class DateService {
    convertDateToUTC(date: string, timezone: string) {
        const curr = moment.tz(date, timezone);
        return curr.utc().format();
    }

    convertToTimestamp(date: string) {
        console.log(process.env.TZ);
        return date.concat('T00:00:00.000Z');
    }

}