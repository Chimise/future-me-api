import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UserService } from "../../users/user.service";
import {parse} from 'cookie';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private userService: UserService) {
        super({
            secretOrKey: configService.get('jwt'),
            jwtFromRequest: (req: Request) => {
                let token: string | null = null;
                if (req && req.cookies) {
                    token = req.cookies['x-auth-token'];
                } else if (req.get('cookie')) {
                    const cookies = parse(req.get('cookie') as any);
                    token = cookies['x-auth-token']
                }

                return token;
            },
            ignoreExpiration: false
        })
    }

    async validate(payload: any) {
        const id = payload?.id as string;
        const user = await this.userService.findOne(id);
        if (!user) {
            throw new UnauthorizedException('Invalid token, authentication failed');
        }

        return user;
    }

}