import {IsString, MinLength, IsEmail, IsBoolean, IsEnum} from 'class-validator';
import { Role } from '../../common/interfaces/auth.interface';

export class UpdateUserDto {
    @MinLength(5, {message: 'Password should be at least five characters'})
    @IsString()
    password?: string

    @IsEmail()
    email?: string;

    @IsBoolean()
    is_email_verified?: boolean;

    @IsString()
    profile_image?: string;

    @IsString()
    name?: string

    @IsString()
    gender?: string

    @IsEnum(Role)
    role?: Role

}