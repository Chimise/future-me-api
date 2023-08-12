import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [UserModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            return {
                secret: configService.get('jwt'),
            }
        }
    }), PassportModule],
    providers: [JwtStrategy]
})
export class AuthModule {

}