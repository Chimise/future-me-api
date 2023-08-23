import { Injectable } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { User } from "../users/user.entity";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AccountService {
    constructor(private userService: UserService, private authService: AuthService) {}

    public updateProfile(user: User, data: Partial<Pick<User, 'email'|'gender'|'name'>>) {
        return this.userService.update(user, data);
    }

    public async updatePassword(user: User, newPassword: string) {
        const hashedPassword = await this.authService.hashPassword(newPassword);
        return this.userService.update(user, {password: hashedPassword});
    }

    public deleteAccount(user: User) {
        return this.userService.delete(user);
    }
}