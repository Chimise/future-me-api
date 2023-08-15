import { Controller, Post, Body, Res, Get, UseGuards} from "@nestjs/common";
import { Response} from "express";
import { AuthService } from "./auth.service";
import { AuthData } from "./dto";
import { GoogleGuard } from "src/common/guard/google.guard";
import { UserInfo } from "src/common/decorators/user.decorator";
import { User } from "src/users/user.entity";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() data: AuthData, @Res({passthrough: true}) res: Response) {
        const user = await this.authService.signup(data.email, data.password);
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