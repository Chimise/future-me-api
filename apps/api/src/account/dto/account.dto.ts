import {IsString, IsEmail, MinLength} from 'class-validator'

export class UpdateProfileDto {
    @IsString()
    name?: string

    @IsEmail()
    email?: string

    @IsString()
    gender?: string

}

export class UpdatePasswordDto {
    @MinLength(5, {message: 'Password should be at least five characters'})
    @IsString()
    password: string;
}