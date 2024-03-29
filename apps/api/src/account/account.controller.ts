import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserInfo } from "../common/decorators/user.decorator";
import { JwtGuard } from "../common/guard/jwt.guard";
import { User } from "../users/user.entity";
import { AccountService } from "./account.service";
import { UpdatePasswordDto, UpdateProfileDto } from "./dto/account.dto";


@UseGuards(JwtGuard)
@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @Get('profile')
    getProfile(@UserInfo() user: User) {
        return user;
    }

    @Post('profile')
    updateProfile(@UserInfo() user: User, @Body() body: UpdateProfileDto) {
        return this.accountService.updateProfile(user, body);
    }

    @Post('password')
    updatePassword(@UserInfo() user: User, @Body() body: UpdatePasswordDto) {
        return this.accountService.updatePassword(user, body.password);
    }

    @Post('delete')
    delete(@UserInfo() user: User) {
        return this.accountService.deleteAccount(user);
    }
}