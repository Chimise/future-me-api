import { IsString, IsEmail, MinLength } from "class-validator";

export class AuthData {
    @IsEmail()
    email: string;

    @MinLength(5, {message: 'Password should be at least five characters'})
    @IsString()
    password: string;
}