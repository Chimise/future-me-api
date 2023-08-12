import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserToken } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserToken])],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {

}