import { MiddlewareConsumer, Module, NestModule, forwardRef } from "@nestjs/common";
import { TypeOrmModule, InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import {TypeormStore} from 'connect-typeorm';
import * as session from 'express-session';
import { UserModule } from "../users/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import {Session} from './session.entity';

@Module({
    imports: [forwardRef(() => UserModule), ConfigModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            return {
                secret: configService.get('jwt'),
            }
        }
    }), PassportModule, TypeOrmModule.forFeature([Session])],
    controllers: [AuthController],
    providers: [JwtStrategy, AuthService, GoogleStrategy],
    exports: [AuthService, ]
})
export class AuthModule implements NestModule {
    constructor(@InjectRepository(Session) private sessionRepository: Repository<Session>, private configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(session({
            store: new TypeormStore({
                cleanupLimit: 2,
                ttl: 86400
            }).connect(this.sessionRepository),
            secret: this.configService.get('sessionSecret') as string,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            }
        })).forRoutes('*');
    }
}