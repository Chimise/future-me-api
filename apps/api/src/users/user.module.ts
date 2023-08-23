import { Module, forwardRef} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserToken } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserToken]), forwardRef(() => AuthModule)],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {

}