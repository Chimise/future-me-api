import { Controller, Post, Body, Res, Get, UseGuards, Session} from "@nestjs/common";
import { Response} from "express";
import { AuthService } from "./auth.service";
import { AuthData } from "./dto";
import { GoogleGuard } from "../common/guard/google.guard";
import { UserInfo } from "../common/decorators/user.decorator";
import { User } from "../users/user.entity";
import {adminUserEmails} from '../common/constants';
import { Role } from "../common/interfaces/auth.interface";
import { session } from "passport";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() data: AuthData, @Res({passthrough: true}) res: Response, @Session() session: any) {
        let role: Role = Role.User;
        if(adminUserEmails.includes(data.email)) {
            role = Role.Admin;
        }

        const user = await this.authService.signup(data.email, data.password, role, session.user);
        const token = await this.authService.generateToken(user);
        this.authService.setJwtCookie(res, token);
        return user;
    }

    @Post('login')
    async login(@Body() data: AuthData, @Res({passthrough: true}) res: Response) {
        const user = await this.authService.login(data.email, data.password);
        const token = await this.authService.generateToken(user);
        this.authService.setJwtCookie(res, token);
        return user;
    }

    @UseGuards(GoogleGuard)
    @Get('login/google')
    async loginWithGoogle() {
        console.log('Redirecting to google server');
    }

    @UseGuards(GoogleGuard)
    @Get('redirect/google')
    async googleCallback(@UserInfo() user: User, @Res({passthrough: true}) res: Response) {
        const token = await this.authService.generateToken(user);
        this.authService.setJwtCookie(res, token);
        return user;
    }
}
