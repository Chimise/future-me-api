import { Controller, UseGuards, Get } from "@nestjs/common";
import {JwtGuard} from '../common/guard/jwt.guard';
import { UserInfo } from "src/common/decorators/user.decorator";
import { User} from "./user.entity";


@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getUserInfo(@UserInfo() user: User ) {
        return user;
    }
}