import { IsEmail } from "class-validator";

export class SendEmailDto {
    @IsEmail(undefined, { message: 'Enter a valid email' })
    email: string;
}