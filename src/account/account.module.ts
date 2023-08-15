import {Module} from '@nestjs/common';
import { UserModule } from 'src/users/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
    imports: [UserModule, AuthModule],
    controllers: [AccountController],
    providers: [AccountService]
})
export class AccountModule {

}