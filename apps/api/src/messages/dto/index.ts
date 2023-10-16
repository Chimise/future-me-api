import { IsEnum, IsString, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, IsOptional } from 'class-validator';
import * as moment from 'moment-timezone';
import { MessageStatus } from 'app/shared';


@ValidatorConstraint({ name: 'IsValidDate', async: false })
export class IsValidDate implements ValidatorConstraintInterface {
    validate(value: string, validationArguments?: ValidationArguments | undefined): boolean | Promise<boolean> {
        if(!value) {
            return false;
        }
        return moment(value, 'YYYY-MM-DD', true).isValid();
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        if(!validationArguments?.value) {
            return `Property ${validationArguments?.property} is required`;
        }
        return `Date ${validationArguments?.value} is invalid, check and try again`;
    }
}

@ValidatorConstraint({name: 'IsTimezone'})
export class IsTimeZone implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments | undefined): boolean | Promise<boolean> {
        if(!value || typeof value !== 'string') {
            return false;
        }
        const zone = moment.tz.names().find(name => name.toLowerCase() === value.toLowerCase());
        return !!zone;
    }

    defaultMessage(validationArguments?: ValidationArguments | undefined): string {
        if(!validationArguments?.value) {
            return `Property ${validationArguments?.property} is required`;
        }

        return `Invalid timezone ${validationArguments.value}`;
    }
}

export class CreateMessageDto {
    @Validate(IsValidDate)
    date: string;

    @Validate(IsTimeZone)
    timezone: string;

    @IsOptional()
    @IsEnum(MessageStatus)
    type?: MessageStatus;

    @IsString()
    content: string;
}





