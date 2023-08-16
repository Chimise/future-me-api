import { IsString, IsEmail, MinLength, IsEnum } from "class-validator";
import { Role } from "src/common/interfaces/auth.interface";

export class AuthData {
    @IsEmail()
    email: string;

    @MinLength(5, {message: 'Password should be at least five characters'})
    @IsString()
    password: string;
}


export class AuthSignUpData extends AuthData {
    @IsEnum(Role)
    role?: Role;
}